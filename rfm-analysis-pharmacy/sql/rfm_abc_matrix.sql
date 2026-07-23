SELECT
    segment,
    abc_revenue,
    COUNT(*) AS customers,
    ROUND(SUM(total_revenue), 0) AS segment_revenue,
    ROUND(AVG(total_revenue), 2) AS avg_revenue_per_customer,
    ROUND(
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (),
        2
    ) AS customer_share_pct,
    ROUND(
        SUM(total_revenue) * 100.0 / SUM(SUM(total_revenue)) OVER (),
        2
    ) AS revenue_share_pct
FROM abc
GROUP BY segment, abc_revenue
ORDER BY
    CASE segment
        WHEN 'Чемпионы' THEN 1
        WHEN 'Лояльные' THEN 2
        WHEN 'Под угрозой' THEN 3
        WHEN 'Нельзя терять' THEN 4
        ELSE 5
    END,
    abc_revenue
