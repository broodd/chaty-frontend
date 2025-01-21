'use strict';

const socket = io('wss://api-dev.aylinhontas.edein.name', {
  auth: { token: this.accessToken },
  transports: ['websocket'],
  reconnectionAttempts: 5,
});

// handle errors
socket.on('SOCKET_ERROR', (error) => {
  console.error('--- SOCKET_ERROR', error);
});

// Send text message
const message = {
  text, // MaxLength (5120)
  chat: { id: chatId },
};
socket.emit('CHAT_SEND_MESSAGE', message);

// Send file message
`POST /api/v1/chat-messages/chats/{id}/messages/file`;

// after sending message, all participants (include sender)
// Receive message
socket.on('CHAT_RECEIVE_MESSAGE', ({ message }) => {
  console.log('--- ', message);
  /*
		Example message response
		{
			"text": "somad",
			"chatId": "7b65df2a-f6de-496a-bd96-d41e5cf87238",
			"ownerId": "067f2f3e-b936-4029-93d6-b2f58ae4f489",
			"chat": {
				"id": "7b65df2a-f6de-496a-bd96-d41e5cf87238"
			},
			"owner": {
				"id": "067f2f3e-b936-4029-93d6-b2f58ae4f489"
			},
			"readAt": null, // Date if read
			"storyId": null,
			"id": "bed9000b-f4ab-40ef-921e-8e27c43aa73b",
			"createdAt": "2025-01-17T11:46:13.258Z",
			"updatedAt": "2025-01-17T11:46:13.258Z"
		}
	*/
});

// for read message
socket.emit('CHAT_READ_MESSAGE', { id: messageId, chat: { id: chatId } });

// after receiver read, all participants (include receiver & sender)
// handle socket message from backend of messageId which was read
socket.on('CHAT_READ_MESSAGE', ({ chat, message }) => {});
