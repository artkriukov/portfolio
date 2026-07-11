SELECT
    segment
    ,COUNT(*) AS customers
    ,SUM(COUNT(*)) OVER () AS total_customers
    ,SUM(total_revenue) AS total_revenue_per_segment
    ,ROUND(AVG(total_revenue), 2) AS avg_revenue_per_customer
    ,ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ())::numeric, 2) AS customer_share_pct
    ,ROUND(SUM(total_revenue) * 100.0 / SUM(SUM(total_revenue)) OVER (), 2) AS revenue_share_pct
FROM rfm_final
GROUP BY segment
ORDER BY customers DESC