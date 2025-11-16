'use client';
import { io } from 'socket.io-client';

// store sockets per namespace
const socketInstances = {};

export const createSocket = (namespace = '/') => {
  if (socketInstances[namespace]) {
    return { socket: socketInstances[namespace], isError: false };
  }

  let isError = false;

  const socket = io(`http://localhost:8081${namespace}`, {
    auth: { accessToken: "Test Token" },
    transports: ['websocket'],
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log(`✅ Connected to namespace: ${namespace}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Disconnected from namespace: ${namespace}`);
  });

  socket.on('connect_error', (err) => {
    console.error(`⚠️ Connection error on ${namespace}:`, err.message);
    isError = true;
  });

  socketInstances[namespace] = socket;

  return { socket, isError };
};
