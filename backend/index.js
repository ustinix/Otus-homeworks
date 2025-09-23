import { Server } from 'socket.io';

const server = new Server(3000, {
  cors: {
    origin: '*',
  },
})

console.log('WebSocket Server started on port 3000');

server.on('connection', (clientSocket) => {
    clientSocket.on('add-to-cart', (payload) => {
    server.emit('add-to-cart', payload);
  });

  clientSocket.on('remove-from-cart', (payload) => {
    server.emit('remove-from-cart', payload);
  });

  clientSocket.on('update-cart-item', (payload) => {
    server.emit('update-cart-item', payload);
  });

  clientSocket.on('clear-cart', (payload) => {
    server.emit('clear-cart', payload);
  });

  clientSocket.on('get-cart-state', () => {
    server.emit('get-cart-state-request');
  });

  clientSocket.on('send-cart-state', (payload) => {
    server.emit('receive-cart-state', payload);
  });

  clientSocket.on('disconnect', () => {
    console.log('Client disconnected:', clientSocket.id);
  });

})

console.log('Cart WebSocket Server is running on port 3000')