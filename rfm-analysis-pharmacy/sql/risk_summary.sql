SELECT
    segment,
    abc_revenue,
    COUNT(*) AS customers,
    ROUND(SUM(total_revenue), 0) AS revenue,
    ROUND(SUM(total_revenue) * 0.30, 0) AS revenue_at_risk_if_30pct_churn
FROM abc
WHERE abc_revenue = 'A'
  AND segment IN ('Под угрозой', 'Нельзя терять')
GROUP BY segment, abc_revenue

UNION ALL

SELECT
    'Чемпионы (апселл)' AS segment,
    abc_revenue,
    COUNT(*) AS customers,
    ROUND(SUM(total_revenue), 0) AS revenue,
    NULL::numeric AS revenue_at_risk_if_30pct_churn
FROM abc
WHERE segment = 'Чемпионы'
  AND abc_revenue = 'B'
GROUP BY abc_revenue

UNION ALL

SELECT
    'Потерянные (экономия бюджета)' AS segment,
    abc_revenue,
    COUNT(*) AS customers,
    ROUND(SUM(total_revenue), 0) AS revenue,
    NULL::numeric AS revenue_at_risk_if_30pct_churn
FROM abc
WHERE segment = 'Потерянные'
  AND abc_revenue = 'C'
GROUP BY abc_revenue

ORDER BY customers DESC
