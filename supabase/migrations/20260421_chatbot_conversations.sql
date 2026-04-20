-- ─────────────────────────────────────────────────────────────
-- Chatbot conversations + messages + leads
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────

-- 1. Main conversations table (one row per user session)
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id        TEXT            NOT NULL UNIQUE,
    created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    message_count     INT             NOT NULL DEFAULT 0,
    language          TEXT            DEFAULT 'sk',

    -- Topic tags (auto-generated based on message content)
    -- Possible values: 'web', 'chatbot', 'automatizacia', 'grafika', 'marketing', 'cennik', 'other'
    tags              TEXT[]          NOT NULL DEFAULT '{}',

    -- Lead info (populated when bot or client provides contact details)
    is_lead           BOOLEAN         NOT NULL DEFAULT FALSE,
    lead_name         TEXT,
    lead_email        TEXT,
    lead_phone        TEXT,
    lead_interest     TEXT,           -- short description of what they want
    lead_captured_at  TIMESTAMPTZ,

    -- Admin-side lead management
    -- 'new' (unseen), 'seen' (opened in admin), 'contacted' (replied), 'closed' (done/irrelevant)
    status            TEXT            NOT NULL DEFAULT 'new',
    admin_notes       TEXT,

    -- AI-generated summary (last user problem, for quick scan)
    summary           TEXT,

    -- First + last user messages for quick preview
    first_user_msg    TEXT,
    last_user_msg     TEXT
);

CREATE INDEX IF NOT EXISTS chatbot_conversations_created_idx
    ON chatbot_conversations (created_at DESC);
CREATE INDEX IF NOT EXISTS chatbot_conversations_is_lead_idx
    ON chatbot_conversations (is_lead, status, created_at DESC);
CREATE INDEX IF NOT EXISTS chatbot_conversations_tags_idx
    ON chatbot_conversations USING GIN (tags);

-- 2. Messages table (one row per message)
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id   UUID            NOT NULL REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    role              TEXT            NOT NULL CHECK (role IN ('user', 'assistant')),
    content           TEXT            NOT NULL,
    created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chatbot_messages_conversation_idx
    ON chatbot_messages (conversation_id, created_at ASC);

-- 3. Keep updated_at fresh on conversation touch
CREATE OR REPLACE FUNCTION touch_chatbot_conversation()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chatbot_conversations
       SET updated_at    = NOW(),
           message_count = message_count + 1
     WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chatbot_messages_touch_conv ON chatbot_messages;
CREATE TRIGGER chatbot_messages_touch_conv
AFTER INSERT ON chatbot_messages
FOR EACH ROW EXECUTE FUNCTION touch_chatbot_conversation();

-- 4. RLS (lock down — only service role can write, only server reads from admin routes)
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages      ENABLE ROW LEVEL SECURITY;

-- No permissive policies needed — server routes use service_role key which bypasses RLS.
-- If later you want public read of a single conversation by session_id, add a SELECT policy here.
