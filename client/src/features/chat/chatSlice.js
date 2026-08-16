import { createSlice } from '@reduxjs/toolkit';
import { sendChat, getConversations, getConversationMessages, deleteConversationApi } from '../../api/chatApi';

const initialState = {
  activeConversation: null,
  conversationId: null,
  messages: [],
  conversations: [],
  isLoadingMessages: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startNewChat: (state) => {
      state.activeConversation = null;
      state.conversationId = null;
      state.messages = [];
    },
    addUserMessage: (state, action) => {
      state.messages.push({ id: Date.now(), sender: 'user', text: action.payload });
    },
    addAssistantMessage: (state, action) => {
      const { id, text, type } = action.payload || {};
      state.messages.push({ id: id || Date.now(), sender: 'assistant', text: text || '', type: type || null });
    },
    appendToMessage: (state, action) => {
      const { id, chunk } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) {
        msg.text += chunk;

        const trimmed = msg.text.trim();
        if (!msg.type && /^```[\s\S]*```$/.test(trimmed)) {
          msg.type = 'code';
        }
      }
    },
    setConversationMeta: (state, action) => {
      const { conversationId, conversationTitle } = action.payload;
      if (conversationId) {
        state.conversationId = conversationId;
      }
      if (conversationTitle) {
        state.activeConversation = conversationTitle;
        const targetId = conversationId || state.conversationId;
        const exists = state.conversations.find((c) => (c._id || c.id) === targetId);
        if (!exists && targetId) {
          state.conversations.unshift({
            _id: targetId,
            id: targetId,
            title: conversationTitle,
            createdAt: new Date().toISOString(),
          });
        }
      }
    },
    setConversations: (state, action) => {
      state.conversations = (action.payload || []).map((c) => ({
        ...c,
        id: c._id || c.id,
      }));
    },
    deleteConversation: (state, action) => {
      const id = action.payload;
      state.conversations = state.conversations.filter((c) => (c._id || c.id) !== id);
      if (state.conversationId === id) {
        state.activeConversation = null;
        state.conversationId = null;
        state.messages = [];
      }
    },
    setActiveConversation: (state, action) => {
      const { id, title, messages } = action.payload;
      state.conversationId = id;
      state.activeConversation = title;
      state.messages = messages || [];
      state.isLoadingMessages = false;
    },
    setLoadingMessages: (state, action) => {
      state.isLoadingMessages = action.payload;
    },
    updateMessage: (state, action) => {
      const { id, text } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) msg.text = text;
    },
  },
});

export const {
  startNewChat,
  addUserMessage,
  addAssistantMessage,
  appendToMessage,
  setConversationMeta,
  setConversations,
  deleteConversation,
  setActiveConversation,
  setLoadingMessages,
  updateMessage,
} = chatSlice.actions;

// Thunk: Load messages for a selected conversation
export const loadConversation = (conversation) => async (dispatch) => {
  const convId = conversation._id || conversation.id;
  dispatch(setLoadingMessages(true));
  try {
    const res = await getConversationMessages(convId);
    if (res.data?.status === 'success' && res.data.data) {
      const formattedMessages = res.data.data.map((m) => {
        let text = m.content || '';
        if (text.includes('data:')) {
          text = text.replace(/(^|\n)data:\s*/g, '$1').replace(/\s+data:\s+/g, ' ');
        }
        return {
          id: m._id,
          sender: m.author === 'ai' ? 'assistant' : 'user',
          text,
          createdAt: m.createdAt,
        };
      });
      dispatch(
        setActiveConversation({
          id: convId,
          title: conversation.title,
          messages: formattedMessages,
        })
      );
      return;
    }
  } catch (err) {
    console.warn('Could not fetch messages from backend, falling back:', err);
  }

  // Fallback if network issue
  dispatch(
    setActiveConversation({
      id: convId,
      title: conversation.title,
      messages: [
        { id: 1, sender: 'user', text: conversation.title },
        {
          id: 2,
          sender: 'assistant',
          text: `Loaded conversation: **${conversation.title}**`,
        },
      ],
    })
  );
};

// Thunk: send message and stream assistant tokens
export const sendMessageAsync = ({ message, ConversationId } = {}) => async (dispatch) => {
  // Add user message to UI
  dispatch(addUserMessage(message));

  // Add assistant placeholder and capture its id
  const assistantId = Date.now() + 1;
  dispatch(addAssistantMessage({ id: assistantId, text: '' }));

  try {
    const meta = await sendChat({ message, ConversationId }, (chunk) => {
      dispatch(appendToMessage({ id: assistantId, chunk }));
    });

    if (meta && (meta.conversationId || meta.conversationTitle)) {
      dispatch(
        setConversationMeta({
          conversationId: meta.conversationId,
          conversationTitle: meta.conversationTitle,
        })
      );
      // Refresh list to keep sidebar synchronized
      dispatch(fetchConversations());
    }
  } catch (err) {
    console.warn('Backend send failed:', err);
    setTimeout(() => {
      const cleanPrompt = message.replace(/^\[.*?\]\s*/, '');
      const simulatedResponse = `Here's a simple JavaScript function to add two numbers:\n\n\`\`\`javascript\nfunction addTwoNumbers(a, b) {\n    return a + b;\n}\n\n// Example usage:\nconst num1 = 5;\nconst num2 = 10;\nconst result = addTwoNumbers(num1, num2);\nconsole.log(result); // Output: 15\n\`\`\`\n\nAlternatively, you can use an arrow function:`;
      dispatch(updateMessage({ id: assistantId, text: simulatedResponse }));
    }, 500);
  }
};

export const fetchConversations = () => async (dispatch) => {
  try {
    const res = await getConversations();
    if (res.data?.data) {
      dispatch(setConversations(res.data.data));
    }
  } catch (err) {
    console.warn('fetchConversations error:', err);
  }
};

export const deleteConversationAsync = (id) => async (dispatch) => {
  dispatch(deleteConversation(id));
  try {
    await deleteConversationApi(id);
  } catch (err) {
    console.warn('deleteConversation error:', err);
  }
};

export default chatSlice.reducer;

