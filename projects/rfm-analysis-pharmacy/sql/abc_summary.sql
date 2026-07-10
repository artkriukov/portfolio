WITH user_agg AS (
    SELECT
        card
        ,EXTRACT(
            DAY FROM (SELECT MAX(datetime) FROM Bonuscheques) - MAX(datetime)
        ) AS recency_days
        ,COUNT(*) AS purchase_cnt
        ,SUM(summ) AS total_revenue
    FROM Bonuscheques
    WHERE card LIKE '2000%'
      AND datetime >= (
            SELECT MAX(datetime) - INTERVAL '1 year'
            FROM Bonuscheques
        )
    GROUP BY card
),
percentiles AS (
    SELECT
        percentile_cont(0.25) WITHIN GROUP (ORDER BY recency_days) AS r_p25
        ,percentile_cont(0.50) WITHIN GROUP (ORDER BY recency_days) AS r_p50
        ,percentile_cont(0.75) WITHIN GROUP (ORDER BY recency_days) AS r_p75

        ,percentile_cont(0.25) WITHIN GROUP (ORDER BY purchase_cnt) AS f_p25
        ,percentile_cont(0.50) WITHIN GROUP (ORDER BY purchase_cnt) AS f_p50
        ,percentile_cont(0.75) WITHIN GROUP (ORDER BY purchase_cnt) AS f_p75

        ,percentile_cont(0.25) WITHIN GROUP (ORDER BY total_revenue) AS m_p25
        ,percentile_cont(0.50) WITHIN GROUP (ORDER BY total_revenue) AS m_p50
        ,percentile_cont(0.75) WITHIN GROUP (ORDER BY total_revenue) AS m_p75
    FROM user_agg
),
rfm_scores AS (
    SELECT
        u.card
        ,u.recency_days
        ,u.purchase_cnt
        ,u.total_revenue

        ,CASE
            WHEN u.recency_days <= p.r_p25 THEN 4
            WHEN u.recency_days <= p.r_p50 THEN 3
            WHEN u.recency_days <= p.r_p75 THEN 2
            ELSE 1
        END AS r_score

        ,CASE
            WHEN u.purchase_cnt <= p.f_p25 THEN 1
            WHEN u.purchase_cnt <= p.f_p50 THEN 2
            WHEN u.purchase_cnt <= p.f_p75 THEN 3
            ELSE 4
        END AS f_score

        ,CASE
            WHEN u.total_revenue <= p.m_p25 THEN 1
            WHEN u.total_revenue <= p.m_p50 THEN 2
            WHEN u.total_revenue <= p.m_p75 THEN 3
            ELSE 4
        END AS m_score
    FROM user_agg u
    CROSS JOIN percentiles p
),
rfm_final AS (
    SELECT
        card
        ,recency_days
        ,purchase_cnt
        ,total_revenue
        ,r_score
        ,f_score
        ,m_score
        ,CONCAT(r_score, f_score, m_score) AS rfm_code
        ,CASE
            WHEN (r_score + f_score + m_score) >= 11
                THEN 'Чемпионы'
            WHEN (r_score + f_score + m_score) BETWEEN 7 AND 10
                THEN 'Лояльные'
            WHEN (r_score + f_score + m_score) = 6
                THEN 'Под угрозой'
            WHEN (r_score + f_score + m_score) = 5
                THEN 'Нельзя терять'
            ELSE 'Потерянные'
        END AS segment
    FROM rfm_scores
)
,abc_base AS (
    SELECT
        card
        ,recency_days
        ,purchase_cnt
        ,total_revenue
        ,r_score
        ,f_score
        ,m_score
        ,rfm_code
        ,segment
        ,SUM(total_revenue) OVER (
            ORDER BY total_revenue DESC, card
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cum_revenue
        ,SUM(total_revenue) OVER () AS total_revenue_all
    FROM rfm_final
),
abc AS (
    SELECT
        card
        ,recency_days
        ,purchase_cnt
        ,total_revenue
        ,r_score
        ,f_score
        ,m_score
        ,rfm_code
        ,segment
        ,ROUND(
            cum_revenue * 100.0 / total_revenue_all
            ,2
        ) AS cum_revenue_pct
        ,CASE
            WHEN cum_revenue / total_revenue_all <= 0.80 THEN 'A'
            WHEN cum_revenue / total_revenue_all <= 0.95 THEN 'B'
            ELSE 'C'
        END AS abc_revenue
    FROM abc_base
)

SELECT
    abc_revenue
    ,COUNT(*) AS customers
    ,ROUND(
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()
        ,2
    ) AS customer_share_pct

    ,SUM(total_revenue) AS revenue

    ,ROUND(
        SUM(total_revenue) * 100.0 /
        SUM(SUM(total_revenue)) OVER ()
        ,2
    ) AS revenue_share_pct
FROM abc
GROUP BY abc_revenue
ORDER BY abc_revenue

