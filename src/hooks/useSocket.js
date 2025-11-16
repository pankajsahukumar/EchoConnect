'use client';
import { useCallback } from 'react';
import { createSocket } from 'src/utils/createSocket';

const useSocket = (namespace = '/') => {
  const getSocket = useCallback(() => createSocket(namespace), [namespace]);
  const { isError, socket } = getSocket();
  return { socket, isError };
};

export default useSocket;
