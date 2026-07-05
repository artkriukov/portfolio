WITH rfm AS (
    SELECT
        card
        ,(SELECT MAX(datetime) FROM Bonuscheques) - MAX(datetime) AS recency
        ,COUNT(*) AS frequency
        ,SUM(summ) AS monetary
    FROM Bonuscheques
    WHERE card LIKE '200%'
    GROUP BY card
),
bounds AS (
    SELECT
        percentile_cont(array[0.33, 0.66]) WITHIN GROUP (ORDER BY recency) AS r_bounds
        ,percentile_cont(array[0.33, 0.66]) WITHIN GROUP (ORDER BY frequency) AS f_bounds
        ,percentile_cont(array[0.33, 0.66]) WITHIN GROUP (ORDER BY monetary) AS m_bounds
    FROM rfm
),
rfm_score AS (
    SELECT
        r.card
        ,CASE
            WHEN r.recency <= r_bounds[1] THEN 3
            WHEN r.recency <= r_bounds[2] THEN 2
            ELSE 1
        END AS r_score
        ,CASE
            WHEN r.frequency <= f_bounds[1] THEN 1
            WHEN r.frequency <= f_bounds[2] THEN 2
            ELSE 3
        END AS f_score
        ,CASE
            WHEN r.monetary <= m_bounds[1] THEN 1
            WHEN r.monetary <= m_bounds[2] THEN 2
            ELSE 3
        END AS m_score
    FROM rfm r
    CROSS JOIN bounds b
)

SELECT
    CASE
        WHEN r_score = 3 AND f_score = 3 AND m_score = 3 THEN 'VIP'
        WHEN r_score = 3 AND f_score >= 2 AND m_score >= 2 THEN 'Лояльные'
        WHEN r_score = 3 AND f_score = 1 THEN 'Новички'
        WHEN r_score = 3 THEN 'Растущие'
        WHEN r_score = 2 THEN 'Требуют внимания'
        WHEN r_score = 1 AND f_score = 3 AND m_score >= 2 THEN 'В зоне риска'
        WHEN r_score = 1 AND (f_score >= 2 OR m_score >= 2) THEN 'На грани ухода'
        ELSE 'Спящие'
    END AS segment
    ,COUNT(*) AS customers
FROM rfm_score
GROUP BY segment