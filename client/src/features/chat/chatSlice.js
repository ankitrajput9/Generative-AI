import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeConversation: 'welcome',
  messages: [
    { id: 1, sender: 'assistant', text: 'Welcome! Ask me anything about your workspace.' },
  ],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        sender: 'user',
        text: action.payload,
      });
      state.messages.push({
        id: Date.now() + 1,
        sender: 'assistant',
        text: `Echo: ${action.payload}`,
      });
    },
  },
});

export const { sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
