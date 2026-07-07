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
            WHEN r_score = 4 AND f_score = 4 AND m_score >=3
                THEN 'Чемпионы'
            
            WHEN r_score >=3  AND f_score >=3
                THEN 'Лояльные'
            
            WHEN r_score =4  AND f_score <=2
                THEN 'Перспективные'
            
            WHEN r_score <=2  AND (f_score >=3 OR m_score >=3)
                THEN 'Под угрозой'

            WHEN r_score <=2 AND f_score =2
                THEN 'Спящие'
            
            WHEN r_score <=2  AND f_score <=1
                THEN 'Потерянные'
            
            ELSE 'Другие'
            
        END segment
    FROM rfm_scores
)

SELECT
    segment
    ,COUNT(*) AS customers
    ,SUM(COUNT(*)) OVER () AS total_customers
    ,ROUND(AVG(purchase_cnt), 2) AS avg_purchases
    ,ROUND(AVG(total_revenue), 2) AS avg_revenue_per_customer
    ,ROUND(AVG(recency_days)::numeric, 1) AS avg_days_since_purchase
    ,ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ())::numeric, 2) AS customer_share_pct
FROM rfm_final
GROUP BY segment
ORDER BY customers DESC