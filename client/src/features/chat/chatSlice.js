import { createSlice } from '@reduxjs/toolkit';
import { sendChat, getConversations } from '../../api/chatApi';

const initialState = {
  activeConversation: null,
  conversationId: null,
  messages: [
    { id: 1, sender: 'assistant', text: 'Welcome! Ask me anything about your workspace.' },
  ],
  conversations: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
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
        if (/```/.test(msg.text)) msg.type = 'code';
      }
    },
    setConversationMeta: (state, action) => {
      const { conversationId, conversationTitle } = action.payload;
      state.conversationId = conversationId || state.conversationId;
      if (conversationTitle) state.activeConversation = conversationTitle;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload || [];
    },
    updateMessage: (state, action) => {
      const { id, text } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) msg.text = text;
    },
  },
});

export const {
  addUserMessage,
  addAssistantMessage,
  appendToMessage,
  setConversationMeta,
  setConversations,
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
      dispatch(setConversationMeta({ conversationId: meta.conversationId, conversationTitle: meta.conversationTitle }));
    });
  } catch (err) {
    dispatch(appendToMessage({ id: assistantId, chunk: '\n[Error receiving response]'}));
    console.error('sendMessageAsync error', err);
  }
};

export const fetchConversations = () => async (dispatch) => {
  try {
    const res = await getConversations();
    dispatch(setConversations(res.data?.data || []));
  } catch (err) {
    console.error('fetchConversations error', err);
  }
};

export default chatSlice.reducer;
