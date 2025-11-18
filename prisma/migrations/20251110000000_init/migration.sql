CREATE TABLE users (
  id uuid PRIMARY KEY,
  username text,
  created_at timestamptz DEFAULT now()
);


CREATE TABLE chats (
  id uuid PRIMARY KEY,
  type text CHECK (type IN ('single','group')),
  title text,
  description text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);


CREATE TABLE chat_participants (
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  role text CHECK (role IN ('owner','admin','participant')) DEFAULT 'participant',
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);


CREATE TABLE chat_files (
  id uuid PRIMARY KEY,
  chat_id uuid REFERENCES chats(id),
  uploader_id uuid REFERENCES users(id),
  path text,            -- локальный путь или URL
  filename text,
  mimetype text,
  size_bytes bigint,
  encrypted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);


CREATE TABLE messages (
  id uuid PRIMARY KEY,
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  -- шифрованные поля:
  encrypted_key bytea,  -- зашифрованный симм. ключ (RSA-OAEP)
  iv bytea,
  auth_tag bytea,
  ciphertext bytea,
  attachments uuid[],   -- array of chat_files.id
  reply_to uuid,        -- messages.id
  deleted boolean DEFAULT false,
  deleted_at timestamptz,
  pinned boolean DEFAULT false
);


CREATE TABLE message_reactions (
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  reaction text, -- emoji / code
  reacted_at timestamptz DEFAULT now(),
  PRIMARY KEY (message_id, user_id, reaction)
);


CREATE TABLE message_reads (
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  read_at timestamptz DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);


CREATE TABLE chat_audit_logs (
  id uuid PRIMARY KEY,
  chat_id uuid REFERENCES chats(id),
  action text,
  performed_by uuid REFERENCES users(id),
  payload jsonb,
  created_at timestamptz DEFAULT now()
);