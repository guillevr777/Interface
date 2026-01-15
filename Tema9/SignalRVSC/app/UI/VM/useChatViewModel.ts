import { useState, useEffect } from 'react';
import { clsMensajeUsuario } from '../Models/clsMensajeModelo';
import { chatService } from '@/app/services/chatServices';

export const useChatViewModel = () => {
  const [messages, setMessages] = useState<clsMensajeUsuario[]>([]);
  const [currentUser, setCurrentUser] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    chatService.startConnection((newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
  }, []);

  const send = async () => {
    if (currentUser && currentMessage) {
      const msgObj = new clsMensajeUsuario(currentUser, currentMessage);
      await chatService.sendMessage(msgObj);
      setCurrentMessage('');
    }
  };

  return {
    messages,
    currentUser,
    setCurrentUser,
    currentMessage,
    setCurrentMessage,
    send
  };
};