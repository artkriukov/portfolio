-- Списки для маркетинговых кампаний: RFM-сегмент + фильтр по ABC-классу.
SELECT
    card,
    segment,
    abc_revenue,
    total_revenue,
    recency_days,
    purchase_cnt,
    CASE segment
        WHEN 'Чемпионы' THEN 'Удержание: VIP-предложения и бонусы за повторные покупки'
        WHEN 'Лояльные' THEN 'Развитие: кросс-продажи и рост среднего чека'
        WHEN 'Под угрозой' THEN 'Реактивация: персональные бонусы и напоминания'
        WHEN 'Нельзя терять' THEN 'Win-back: индивидуальный контакт и спецусловия'
        ELSE 'Тест: низкобюджетная массовая коммуникация'
    END AS recommended_action
FROM abc
WHERE (
        segment = 'Чемпионы' AND abc_revenue = 'A'
    )
    OR (segment = 'Лояльные' AND abc_revenue IN ('A', 'B'))
    OR (segment = 'Под угрозой' AND abc_revenue IN ('A', 'B'))
    OR (segment = 'Нельзя терять' AND abc_revenue = 'A')
    OR (segment = 'Потерянные' AND abc_revenue IN ('B', 'C'))
ORDER BY segment, total_revenue DESC
