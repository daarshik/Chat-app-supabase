import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { User, Message } from "../../../types/types";

export default function useChat() {
  // State variables
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle username form submission - create or get user
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      // Check if user exists
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user:", error);
        return;
      }

      // If user exists, use it
      if (data) {
        setCurrentUser(data);
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([{ username, email, phone_number: phoneNumber }])
          .select("*")
          .single();

        if (createError) {
          console.error("Error creating user:", createError);
          return;
        }

        setCurrentUser(newUser);
      }
    } catch (error) {
      console.error("Error in user handling:", error);
    }
  };

  // Load other users once current user is set
  useEffect(() => {
    if (!currentUser) return;

    const loadUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", currentUser.id);

      if (error) {
        console.error("Error loading users:", error);
        return;
      }

      setUsers(data || []);
    };

    loadUsers();

    // Subscribe to new users
    const channel = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        (payload) => {
          const newUser = payload.new as User;
          if (newUser.id !== currentUser.id) {
            setUsers((prev) => [...prev, newUser]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // Get or create conversation when a user is selected
  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    setMessages([]);
    setOtherUserTyping(false);
    const getOrCreateConversation = async () => {
      try {
        // Step 1: Find conversations where both users are participants
        const { data: currentUserConversations, error: error1 } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", currentUser.id);

        if (error1) throw error1;
        if (
          !currentUserConversations ||
          currentUserConversations.length === 0
        ) {
          // No conversations for current user, create a new one
          createNewConversation();
          return;
        }

        // Get all conversation IDs the current user is part of
        const conversationIds = currentUserConversations.map(
          (item) => item.conversation_id
        );

        // Step 2: Find if the selected user is in any of these conversations
        const { data: sharedConversations, error: error2 } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", selectedUser.id)
          .in("conversation_id", conversationIds);

        if (error2) throw error2;

        if (sharedConversations && sharedConversations.length > 0) {
          // Found existing conversation between the users
          setConversationId(sharedConversations[0].conversation_id);
        } else {
          // No shared conversation found, create a new one
          createNewConversation();
        }
      } catch (error) {
        console.error("Error finding conversation:", error);
      }
    };

    // Helper function to create a new conversation
    const createNewConversation = async () => {
      try {
        // Create a new conversation
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert([{}])
          .select("*")
          .single();

        if (createError) throw createError;

        // Add current user to conversation
        const { error: error1 } = await supabase
          .from("conversation_participants")
          .insert([
            {
              conversation_id: newConversation.id,
              user_id: currentUser.id,
            },
          ]);

        if (error1) throw error1;

        // Add selected user to conversation
        const { error: error2 } = await supabase
          .from("conversation_participants")
          .insert([
            {
              conversation_id: newConversation.id,
              user_id: selectedUser.id,
            },
          ]);

        if (error2) throw error2;

        setConversationId(newConversation.id);
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    };

    getOrCreateConversation();
  }, [currentUser, selectedUser]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) return;

    // Clear messages when changing conversations
    setMessages([]);
    setOtherUserTyping(false);

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      setMessages(data || []);
    };

    loadMessages();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          console.log("New message payload:", payload);

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_indicators",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const isDelete = payload.eventType === "DELETE";

          const userId = isDelete ? payload.old?.user_id : payload.new?.user_id;

          const isTyping = isDelete ? false : payload.new?.is_typing;

          // Ignore updates from self
          if (currentUser && userId !== currentUser.id) {
            setOtherUserTyping(isTyping);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [conversationId, currentUser]);

  // Handle typing indicators
  const updateTypingStatus = async (typing: boolean) => {
    if (!currentUser || !conversationId) return;
    const compositeKey = `${conversationId}_${currentUser.id}`;
    try {
      if (typing) {
        // When user starts typing, insert or update the record
        const { error } = await supabase.from("typing_indicators").upsert(
          [
            {
              conversation_id: conversationId,
              user_id: currentUser.id,
              is_typing: true,
              last_updated: new Date().toISOString(),
              composite_key: compositeKey,
            },
          ],
          { onConflict: "composite_key" }
        );

        if (error) {
          console.error("Error updating typing status:", error);
        }
      } else {
        // When user stops typing, update the record
        const { error } = await supabase
          .from("typing_indicators")
          .update({
            is_typing: false,
            last_updated: new Date().toISOString(),
          })
          .eq("composite_key", compositeKey);
        if (error) {
          console.error("Error updating typing status:", error);
        }
        console.log("Typing status updated to false");
      }
    } catch (error) {
      console.error("Error in typing status update:", error);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Start typing
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      updateTypingStatus(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      console.log("Stopping typing");

      setIsTyping(false);
      updateTypingStatus(false);
    }, 2000);

    // If input is empty, stop typing immediately
    if (value.length === 0) {
      setIsTyping(false);
      updateTypingStatus(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !conversationId) return;

    try {
      // Stop typing when sending message
      setIsTyping(false);
      updateTypingStatus(false);

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const { error } = await supabase.from("messages").insert([
        {
          conversation_id: conversationId,
          user_id: currentUser.id,
          content: newMessage,
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error in message handling:", error);
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleSendMessage,
    handleInputChange,
    handleUsernameSubmit,
    username,
    setUsername,
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    conversationId,
    setConversationId,
    isTyping,
    setIsTyping,
    otherUserTyping,
    setOtherUserTyping,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
  };
}
