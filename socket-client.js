io = require('socket.io-client');

const socket = io('http://localhost:3001'); // サーバーのURLを指定

// ルームに参加する
function joinRoom(roomId, userId) {
  console.log('joinRoom', roomId, userId);
  socket.emit('joinRoom', { roomId, userId });

  socket.on('roomData', (data) => {
    console.log('roomData:', data);
  });

  socket.on('roomUpdate', (data) => {
    console.log('roomUpdate:', data);
  });

  // ルームに参加した際にメッセージを受信するためのリスナーを設定
  socket.on('receiveMessage', (content) => {
    console.log('New message:', content);
  });
}

// メッセージを送信する
function putMessage(roomId, userId, content) {
  socket.emit('putMessage', { roomId, userId, content });
}

function leaveRoom(roomId, userId) {
  socket.emit('leaveRoom', { roomId, userId });
}

// joinRoom(
//   '0192bf0a-a849-7da4-bef9-be2777acce1e',
//   '0192b98d-6d94-74b3-a2e1-3b7b96800950',
// );
// leaveRoom(
//   //   '0192b991-5077-759e-901f-878dc397bed6',
//   '0192bf0a-a849-7da4-bef9-be2777acce1e',
//   '0192b98d-6d94-74b3-a2e1-3b7b96800950', // );

joinRoom(
  //   '0192b991-5077-759e-901f-878dc397bed6',
  '0192bf0a-a849-7da4-bef9-be2777acce1e',
  '0192be87-06cb-7cfd-a3c7-c99f2a9b41e5',
);

putMessage(
  //   '0192b991-5077-759e-901f-878dc397bed6',
  '0192bf0a-a849-7da4-bef9-be2777acce1e',
  '0192be87-06cb-7cfd-a3c7-c99f2a9b41e5',
  'Hello, world!',
);

leaveRoom(
  //   '0192b991-5077-759e-901f-878dc397bed6',
  '0192bf0a-a849-7da4-bef9-be2777acce1e',
  '0192be87-06cb-7cfd-a3c7-c99f2a9b41e5',
);
