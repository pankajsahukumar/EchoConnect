import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectChat } from "src/app/main/apps/chat/store/chatSlice";
import { selectCustomer } from "src/app/main/apps/chat/store/customerSlice";

const useCurrentChat = () => {
  const customer = useSelector(selectCustomer);
  const chat = useSelector(selectChat);
  // Optional cleanup of chat object if needed
  // const rawChat = useMemo(() => {
  //   if (!chat) return null;
  //   const { totalMessagesPages, messagesTake, hasPrev, hasNext, currentPage, count, ...rest } = chat;
  //   return rest;
  // }, [chat]);

  const memoData = useMemo(() => {
    return {
      chat,
      id: customer?.chatId || customer?.id || null,
      // rawChat, // include if you're using it
    };
  }, [chat, customer?.chatId]);

  return memoData;
};

export default useCurrentChat;
