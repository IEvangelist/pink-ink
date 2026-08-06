WITH palette (accent, hex_value, contrast_ratio, is_primary) AS (
    SELECT 'pink', '#FF4FA3', 6.37, TRUE
    UNION ALL
    SELECT 'cyan', '#55E6E6', 13.20, FALSE
    UNION ALL
    SELECT 'magenta', '#D979FF', 8.45, FALSE
)
SELECT
    accent,
    UPPER(hex_value) AS normalized_hex,
    ROUND(contrast_ratio, 2) AS contrast_ratio,
    CASE
        WHEN is_primary THEN 'Primary ink'
        WHEN contrast_ratio >= 10 THEN 'High contrast'
        ELSE 'Complementary accent'
    END AS role
FROM palette
WHERE hex_value LIKE '#%'
ORDER BY is_primary DESC, contrast_ratio DESC;
