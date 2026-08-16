import api from './axios';

export const getConversations = () => api.get('/conversation/chat');
export const getConversationMessages = (conversationId) => api.get(`/conversation/messages/${conversationId}`);
export const deleteConversationApi = (conversationId) => api.delete(`/conversation/${conversationId}`);

export async function sendChat({ message, ConversationId } = {}, onChunk) {
	const base = (api && api.defaults && api.defaults.baseURL) || import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
	const url = `${base.replace(/\/$/, '')}/conversation/message`;

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ message, ConversationId }),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Network error: ${res.status} ${text}`);
	}

	const conversationId = res.headers.get('X-Conversation-Id');
	const conversationTitle = res.headers.get('X-Conversation-Title');

	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });

		// SSE events are separated by double newlines. Each event has lines like: "data: <text>"
		const parts = buffer.split('\n\n');
		buffer = parts.pop();

		for (const part of parts) {
			const m = part.match(/data: (.*)/s);
			if (m) {
				onChunk && onChunk(m[1]);
			}
		}
	}

	// flush remainder
	if (buffer) {
		const m = buffer.match(/data: (.*)/s);
		if (m) onChunk && onChunk(m[1]);
	}

	return { conversationId, conversationTitle };
}
