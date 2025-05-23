export type User = {
  id: string;
  username: string;
  created_at: string;
  email: string;
  phone_number: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type TypingIndicator = {
  id: string;
  conversation_id: string;
  user_id: string;
  is_typing: boolean;
  last_updated: string;
  composite_key: string;
};
