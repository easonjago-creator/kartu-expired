CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_number TEXT NOT NULL,
  bank TEXT NOT NULL,
  name TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  alert_days INTEGER NOT NULL DEFAULT 10,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cards_expiry_date ON cards(expiry_date);

INSERT INTO cards (card_number, bank, name, expiry_date, alert_days)
SELECT '082287394582', 'BCA', 'ARIF KURNIA', '2026-08-29', 10
WHERE NOT EXISTS (SELECT 1 FROM cards);
