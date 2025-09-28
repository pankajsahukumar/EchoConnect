
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useParams } from "react-router-dom";
import JsonDdata from "../../../../../TestData.json";
import template from "../../../../../template.json"
// NOTE: These imports assume your existing store slices export these utilities
import {
  getChat,
  selectChat,
  sendMessage,
  addTempMessage,
  // sendTemplateMessage, sendInteractiveReply
} from "../store/chatSlice";
import { selectContactById } from "../store/contactsSlice";
import { selectUser } from "../store/userSlice";
import { ChatAppContext } from "../ChatApp";
import TemplateDialog from "./components/TemplateDialog";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import MessageInput from "./components/MessageInput";
import { getCustomer, selectCustomer } from "../store/customerSlice";
import { ChatMessageModel } from "@models";
import { io } from "socket.io-client";
import { SocketManager } from "@socket";
import TemplatePreview from "../TemplateMessageComponent/TemplatePreview";
import TemplateForm from "../TemplateMessageComponent/TemplateForm";


/**
 * =============================================================
 *  MESSAGE RENDERING + HOVER ACTIONS + QUOTED REPLY SUPPORT
 *  Supports WhatsApp Business API types: text, image, audio, video,
 *  document, location, contacts, interactive (button/list), template
 * =============================================================
 */






export default function Chat(props) {
  const { setMainSidebarOpen, setContactSidebarOpen } =
    useContext(ChatAppContext);
  const dispatch = useDispatch();
  const chat = useSelector(selectChat);
  const user = useSelector(selectUser);
  const customer=useSelector(selectCustomer);
  const routeParams = useParams();
  const contactId = routeParams.id;
  const selectedContact = useSelector((state) =>
    selectContactById(state, contactId)
  );
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [quote, setQuote] = useState(null); // quoted message when replying
  const [highlightedMessageId, setHighlightedMessageId] = useState(null); // for scroll-to-message highlight
  const ws = useRef(null);

  // Handler functions for RenderMessage callbacks
  const handleReply = (replyData) => {
    console.log("Reply clicked:", replyData); // Debug log
    setQuote(replyData.quoted);

    // Focus the input field after setting reply
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Scroll to quoted message functionality
  const scrollToMessage = (messageId) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Highlight the message temporarily
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000); // Remove highlight after 2 seconds
    }
  };

  const handleCopy = (message) => {
    const textToCopy =
      message?.text ||
      message?.payload?.text?.body ||
      message?.interactiveMessage?.body?.text ||
      "Message content";
    navigator.clipboard.writeText(textToCopy);
  };

  const handleForward = (message) => {
    // TODO: Implement forward functionality
    console.log("Forward message:", message);
  };

  const handleDelete = (message) => {
    // TODO: Implement delete functionality
    console.log("Delete message:", message);
  };

  const handleEmojiSelect = (messageId, emoji) => {
    // TODO: Implement emoji reaction functionality
    console.log("Add emoji reaction:", { messageId, emoji });
  };

  const handleSendTemplate = async (templateData) => {
    try {
      // TODO: Implement template sending functionality
      console.log("Sending template:", templateData);
      // Close the template dialog after sending
      setTemplateOpen(false);
    } catch (error) {
      console.error("Error sending template:", error);
    }
  };

useEffect(()=>{

  const fetchData = async () => {
    const resultAction =  await dispatch(
      getCustomer( contactId)
        );

    if (getCustomer.fulfilled.match(resultAction)) {

    dispatch(getChat(resultAction.payload.id));
    } else {
      console.error("Failed to send message:", resultAction.error);
    }
  };
  fetchData();
},[contactId,dispatch])

useEffect(() => {
  if (!customer) return;

  ws.current = SocketManager.socket("/conversations", {
    auth: {
      organizationId: customer.organization_id,
      userId: user.id,
    },
  });
  if (!ws.current.connected) {
    ws.current.connect();
  }

  ws.current.on("connect", () => {
    console.log("✅ Connected to Socket.IO server", user,customer,"this is info");
    // ws.current.emit("joinRoom", { chatId: customer.id });
  });

  ws.current.on("chatMessage", (messageData) => {
    console.log("📩 Socket.IO message received:", messageData);
    dispatch(addTempMessage(messageData));
  });

  ws.current.on("disconnect", () => {
    console.log("❌ Disconnected from Socket.IO server");
  });

  return () => {
    ws.current.off("chatMessage");
    ws.current.disconnect();
  };
}, [customer, contactId, dispatch]);
  
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const handleScroll = () => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.addEventListener('scroll', handleScroll);
      return () => chatRef.current?.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (!ws.current) return;
  
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS message received:", data);
        const messageData = data.payload;
        if (data.type === "chatMessage") {
          dispatch(addTempMessage(messageData));
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };
  }, [ws.current, dispatch]);

  // Effect for handling scroll on chat updates
  useEffect(() => {
    if (!chatRef.current || !shouldAutoScroll || !chat?.length) return;

    const scrollToBottom = () => {
      const scrollElement = chatRef.current;
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth",
        });
        // Ensure FuseScrollbars updates its internal scroll state
        if (scrollElement.updateScroll) {
          scrollElement.updateScroll();
        }
      }
    };

    // Add a small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 200);
    return () => clearTimeout(timeoutId);
  }, [chat, shouldAutoScroll]);
  
  

  // if (!user || !selectedContact) return null;
  if (!user) return null;

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
      setShouldAutoScroll(true);
    }
  };
  return (
    <>
      {/* <ChatHeader contact={selectedContact} onSidebarToggle={() => setMainSidebarOpen(true)} onContactInfo={() => setContactSidebarOpen(true)} /> */}

      <div className="relative flex flex-col flex-1 w-full">
        <ChatMessages
          chat={chat}
          highlightedMessageId={highlightedMessageId}
          onReply={handleReply}
          onCopy={handleCopy}
          onForward={handleForward}
          onDelete={handleDelete}
          onEmojiSelect={handleEmojiSelect}
          onQuoteClick={scrollToMessage}
          chatRef={chatRef}
          className={props.className}
        />     
        {!shouldAutoScroll && (
          <div 
            className="absolute bottom-16 right-4 z-50 cursor-pointer bg-primary text-white rounded-full p-2 shadow-lg hover:bg-primary-dark transition-colors"
            onClick={scrollToBottom}
          >
            <FuseSvgIcon size={24}>heroicons-outline:arrow-down</FuseSvgIcon>
          </div>
        )}
      </div>

      {/* Message Input Area - WhatsApp Style */}
      <MessageInput 
        messageText={messageText}
        setMessageText={setMessageText}
        quote={quote}
        setQuote={setQuote}
        inputRef={inputRef}
        setAnchorEl={setAnchorEl}
        setTemplateOpen={setTemplateOpen}
        anchorEl={anchorEl}
      />
      {/* Template sender dialog */}
      <TemplateDialog
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onSend={handleSendTemplate}
      />
    </>
  );
}
