"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChat } from "src/app/main/apps/chat/store/chatSlice";
import { selectContactByMobile } from "src/app/main/apps/chat/store/contactsSlice";
import { setSelectedCustomer } from "src/app/main/apps/chat/store/customerSlice";

export const useChats = () => {
  const [state, setState] = useState({
    error: null,
    isError: false,
    isLoading: true,
  });

  const dispatch = useDispatch();
  const routeParams = useParams();
  const contactMobile = routeParams.id;

  const contact = useSelector((state) =>
    selectContactByMobile(state, contactMobile)
  );

  useEffect(() => {
    if (!contact) return;

    const fetchChat = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        dispatch(setSelectedCustomer(contact));
        const result = await dispatch(getChat({ chatId: contact.id })).unwrap();

        setState({
          error: null,
          isError: false,
          isLoading: false,
          data: result,
        });
      } catch (err) {
        setState({
          error: err,
          isError: true,
          isLoading: false,
        });
      }
    };

    fetchChat();
  }, [dispatch, contact]);

  return state;
};
