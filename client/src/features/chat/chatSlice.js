import { createSlice } from '@reduxjs/toolkit';
import { sendChat, getConversations } from '../../api/chatApi';

const initialState = {
  activeConversation: null,
  conversationId: null,
  messages: [],
  conversations: [
    
  ],
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
      state.conversationId = conversationId || state.conversationId;
      if (conversationTitle) {
        state.activeConversation = conversationTitle;
        const exists = state.conversations.find((c) => c.id === conversationId);
        if (!exists) {
          state.conversations.unshift({ id: conversationId, title: conversationTitle, timestamp: 'Today' });
        }
      }
    },
    setConversations: (state, action) => {
      state.conversations = action.payload || [];
    },
    deleteConversation: (state, action) => {
      const id = action.payload;
      state.conversations = state.conversations.filter((c) => c.id !== id);
      if (state.conversationId === id) {
        state.activeConversation = null;
        state.conversationId = null;
        state.messages = [];
      }
    },
    selectConversation: (state, action) => {
      const conv = action.payload;
      state.conversationId = conv.id;
      state.activeConversation = conv.title;
      state.messages = [
        { id: 1, sender: 'user', text: 'Let us discuss: ' + conv.title },
        {
          id: 2,
          sender: 'assistant',
          text: 'Here is the discussion for **' + conv.title + '**.\n\n```javascript\n// Example implementation\nexport function example() {\n  console.log("ChatGPT UI loaded!");\n}\n```\n\nFeel free to ask follow-up questions!',
        },
      ];
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
  selectConversation,
  updateMessage,
} = chatSlice.actions;

// Thunk: send message and stream assistant tokens
export const sendMessageAsync = ({ message, ConversationId } = {}) => async (dispatch) => {
  // add user message to UI
  dispatch(addUserMessage(message));

  // add assistant placeholder and capture its id
  const assistantId = Date.now() + 1;
  dispatch(addAssistantMessage({ id: assistantId, text: '' }));

  // stream tokens via API helper
  try {
    await sendChat({ message, ConversationId }, (chunk) => {
      dispatch(appendToMessage({ id: assistantId, chunk }));
    }).then((meta) => {
      if (meta) {
        dispatch(setConversationMeta({ conversationId: meta.conversationId, conversationTitle: meta.conversationTitle }));
      }
    });
  } catch (err) {
    // If backend is not running, provide simulated ChatGPT response demo
    setTimeout(() => {
      const cleanPrompt = message.replace(/^\[.*?\]\s*/, '');
      const simulatedResponse = 'I received your prompt: **"' + cleanPrompt + '"**\n\nHere is a code demonstration with full formatting and syntax highlighting:\n\n```javascript\n// ChatGPT Syntax Highlighted Component\nimport React, { useState } from "react";\n\nexport const GenerativeAI = () => {\n  const [status, setStatus] = useState("active");\n  \n  return (\n    <div className="ai-card">\n      <h2>Status: {status}</h2>\n      <button onClick={() => setStatus("ready")}>Launch</button>\n    </div>\n  );\n};\n```\n\n### Key Features:\n- ⚡ **Real-time syntax highlighting** with highlight.js\n- 📋 **One-click copy code button** with visual feedback\n- 🎨 **Authentic ChatGPT Dark Theme UI**';
      dispatch(updateMessage({ id: assistantId, text: simulatedResponse }));
    }, 600);
    console.warn('Backend API connection simulated or failed:', err);
  }
};

export const fetchConversations = () => async (dispatch) => {
  try {
    const res = await getConversations();
    if (res.data?.data && res.data.data.length > 0) {
      dispatch(setConversations(res.data.data));
    }
  } catch (err) {
    console.warn('fetchConversations fallback to initial list', err);
  }
};

export default chatSlice.reducer;
