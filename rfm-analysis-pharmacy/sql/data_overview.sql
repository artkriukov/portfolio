SELECT
    p.analysis_date,
    p.period_start,
    COUNT(*) AS transactions_cnt,
    COUNT(DISTINCT f.card) AS customers_cnt,
    ROUND(SUM(f.summ), 0) AS total_revenue,
    ROUND(AVG(f.summ), 2) AS avg_check,
    ROUND(
        COUNT(DISTINCT f.card) * 100.0
        / NULLIF((SELECT COUNT(DISTINCT card) FROM Bonuscheques WHERE card LIKE '2000%'), 0),
        2
    ) AS active_share_of_all_cards_pct
FROM filtered_tx f
CROSS JOIN params p
GROUP BY p.analysis_date, p.period_start
