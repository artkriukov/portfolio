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

