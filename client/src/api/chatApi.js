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

	const processLine = (line) => {
		const trimmed = line.trim();
		if (!trimmed || !trimmed.startsWith('data:')) return;
		const rawPayload = trimmed.replace(/^data:\s*/, '');
		if (rawPayload === '[DONE]') return;

		try {
			const parsed = JSON.parse(rawPayload);
			const chunk = typeof parsed === 'string' ? parsed : (parsed?.text ?? parsed?.content ?? '');
			if (chunk) onChunk && onChunk(chunk);
		} catch {
			// Fallback if legacy raw text
			onChunk && onChunk(rawPayload);
		}
	};

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });

		const lines = buffer.split('\n');
		buffer = lines.pop() ?? '';

		for (const line of lines) {
			processLine(line);
		}
	}

	if (buffer) {
		processLine(buffer);
	}

	return { conversationId, conversationTitle };
}
