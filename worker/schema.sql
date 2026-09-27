CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  confirm_token TEXT,
  unsubscribe_token TEXT NOT NULL,
  created_at TEXT NOT NULL,
  confirmed_at TEXT,
  unsubscribed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscribers_confirm_token ON subscribers (confirm_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON subscribers (unsubscribe_token);

CREATE TABLE IF NOT EXISTS sends (
  issue_id TEXT NOT NULL,
  email TEXT NOT NULL,
  sent_at TEXT NOT NULL,
  PRIMARY KEY (issue_id, email)
);
