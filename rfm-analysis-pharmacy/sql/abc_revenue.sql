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
    ,cum_revenue_pct
    ,abc_revenue
FROM abc
ORDER BY total_revenue DESC