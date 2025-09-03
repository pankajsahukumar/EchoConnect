import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { lighten, styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Toolbar from "@mui/material/Toolbar";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import JsonDdata from "../../../../../TestData.json";
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
  const fileInputRef = useRef(null);
  const ws = useRef(null);
  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Picked file:", file);

    // TODO: replace this with actual upload logic
    // For now, dispatch sendMessage with type "image"
    const messageData = {
      type: "image",
      payload: {
        image: {
          name: file.name,
          size: file.size,
          type: file.type,
          // optionally convert to base64 or send FormData
        },
      },
    };

    await dispatch(
      sendMessage({
        contactId,
        ...messageData,
      })
    );

    // Reset input so the same file can be selected again
    event.target.value = "";
  };

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

  // Generic function to get message preview for replies
  

  useEffect(() => {
    if (!user) return; // wait until user is loaded
  
    ws.current = new WebSocket('ws://localhost:8080');
  
    ws.current.onopen = () => {
      console.log('Connected to WebSocket server', user);
      ws.current.send(JSON.stringify({
        type: 'register',
        payload: { userId: user.id, contactId }
      }));
    };
  
    dispatch(getChat(contactId));
  
    return () => {
      ws.current?.close();
    };
  }, [user, contactId, dispatch]);
  
  const reversedData = [...JsonDdata].reverse();
  useEffect(() => {
    if (chatRef.current && chat?.length > 0) {
      setTimeout(() => {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [chat]);

  useEffect(() => {
    if (!ws.current) return;
  
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS message received:", data);
        const messageData=   {
          "message": {
              "text":data.payload.content,
              "messageType": "text"
          },
          "messageOriginType": "CUSTOMER",
          "id": "reply-msg-1",
          "readCount": 1,
          "deliveryCount": 1,
          "erroredCount": 0,
          "dateCreated": "2025-08-29T10:01:00.000Z",
          "dateUpdated": "2025-08-29T10:01:00.000Z",
          "replyMessageId": "original-msg-1",
          "messageTime": 1755496283557,
          "totalCount": 1,
          "errorMessage": null,
          "adReferralData": null,
          "replyMessage": {
              "id": "original-msg-1",
              "messageOriginType": "USER",
              "message": {
                  "text": "Hello! How can I help you today?",
                  "messageType": "text"
              },
              "senderUser": {
                  "id": "user_LSSTd5SOPD",
                  "name": "Support Agent",
                  "phoneNumber": "917828434400"
              },
              "messageTime": 1755496223557
          },
          "senderUser": {
              "id": "customer_123",
              "name": "Pankaj Sahu",
              "phoneNumber": "919876543210"
          },
          "messageMetadata": {}
      };
        // content
        if (data.type === "chatMessage") {
          
          dispatch(addTempMessage(messageData));
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };
  }, [ws.current,dispatch]);
  
  
  async function onMessageSubmit(ev) {
    ev.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed) return;


    try {
      // Prepare message data for the API
      const messageData = {
        messageText: trimmed,
        type: "text",
        payload: { text: { body: trimmed } },
        context: quote ? { message_id: quote.id } : undefined,
      };

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log("Sending message via WebSocket:", messageData);
        ws.current.send(JSON.stringify({
          "type": "chatMessage",
          "payload": {
            "senderId": "cfaad35d-07a3-4447-a6c3-d8c3d54fd5df",
            "receiverId": "user1",
            "content": "Hello from Postman pankaj!"
          }
        }));
      }else{
        console.log("WebSocket not connected");
      }
      // Send message via Redux action
      const resultAction = await dispatch(
        sendMessage({
          contactId,
          ...messageData,
        })
      );

      // Check if the message was sent successfully
      if (sendMessage.fulfilled.match(resultAction)) {
        console.log("Message sent successfully:", resultAction.payload);
      } else {
        console.error("Failed to send message:", resultAction.error);
      }

      // Always clear input and quote after attempting to send
      setMessageText("");
      setQuote(null);

      // Auto-scroll to bottom after sending
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);

      // // Refresh chat to get the latest messages
      // dispatch(getChat({ contactId }));
    } catch (error) {
      console.error("Error sending message:", error);
      // Clear input on error too
      setMessageText("");
      setQuote(null);
    }
  }

  if (!user || !selectedContact) return null;

  return (
    <>
    <ChatHeader contact={selectedContact} onSidebarToggle={() => setMainSidebarOpen(true)} onContactInfo={() => setContactSidebarOpen(true)} />

    <ChatMessages
      chat={reversedData}
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

      {/* Message Input Area - WhatsApp Style */}
     
      <MessageInput 
        messageText={messageText}
        setMessageText={setMessageText}
        quote={quote}
        setQuote={setQuote}
        onMessageSubmit={onMessageSubmit}
        inputRef={inputRef}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
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
