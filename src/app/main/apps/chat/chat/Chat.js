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

// NOTE: These imports assume your existing store slices export these utilities
import {
  getChat,
  selectChat,
  sendMessage,
  // sendTemplateMessage, sendInteractiveReply
} from "../store/chatSlice";
import { selectContactById } from "../store/contactsSlice";
import { selectUser } from "../store/userSlice";
import { ChatAppContext } from "../ChatApp";
import SystemMessageComponent from "./SystemMessage";
import UrlMessage from "./UrlMessage";
import RenderMessage from "../Messages/RenderMessage";
import { ButtonBase } from "@mui/material";
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

const DateSeparator = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  margin: "12px 0",
  "& .date-chip": {
    backgroundColor: "#ffffff",
    color: "#54656f",
    fontSize: "12.5px",
    fontWeight: 400,
    padding: "5px 12px",
    borderRadius: "7.5px",
    boxShadow: "0 1px 0.5px rgba(11,20,26,.13)",
    fontFamily:
      "Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif",
  },
}));

const SystemMessage = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  margin: "12px 0",
  "& .system-chip": {
    backgroundColor: "#ffffff",
    color: "#54656f",
    fontSize: "12.5px",
    fontWeight: 400,
    padding: "6px 12px",
    borderRadius: "7.5px",
    boxShadow: "0 1px 0.5px rgba(11,20,26,.13)",
    fontFamily:
      "Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif",
    textAlign: "center",
    maxWidth: "80%",
  },
}));

const HoverActions = styled("div")(({ theme }) => ({
  position: "absolute",
  top: -16,
  right: -8,
  display: "none",
  gap: 6,
  padding: "8px 12px",
  borderRadius: 16,
  background: theme.palette.background.paper,
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  zIndex: 3,
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: "blur(20px)",
  animation: "slideIn 0.2s ease-out",
  "@keyframes slideIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(8px) scale(0.95)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0) scale(1)",
    },
  },
}));

const Bubble = styled("div")(() => ({
  position: "relative",
  padding: "6px 7px 8px 9px",
  borderRadius: "inherit",
  wordBreak: "break-word",
  lineHeight: "19px",
  fontSize: "14.2px",
  fontFamily:
    "Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif",
  minHeight: "20px",
  "&:hover": {
    [`& ${HoverActions}`]: {
      display: "flex",
    },
  },
}));

function MessageBubble({
  item,
  isMine,
  onReply,
  onCopy,
  onForward,
  onDelete,
  contact,
}) {
  // Handle different message structures
  const messageData = item.message || item;
  const messageType = messageData.messageType || messageData.type;
  const messageText =
    messageData.text ||
    messageData.payload?.text?.body ||
    messageData.payload?.body ||
    "";
  const createdAt = item.dateCreated
    ? new Date(item.dateCreated)
    : item.messageTime
    ? new Date(item.messageTime)
    : item.createdAt
    ? new Date(item.createdAt)
    : new Date();

  // Format time like WhatsApp (HH:MM)
  const timeString = createdAt.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Bubble className="bubble">
      {/* Hover actions */}
      <HoverActions>
        <Tooltip title="Reply">
          <IconButton size="small" onClick={() => onReply({ quoted: item })}>
            <FuseSvgIcon size={20}>heroicons-outline:reply</FuseSvgIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy">
          <IconButton size="small" onClick={() => onCopy(item)}>
            <FuseSvgIcon size={20}>heroicons-outline:duplicate</FuseSvgIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Forward">
          <IconButton size="small" onClick={() => onForward(item)}>
            <FuseSvgIcon size={20}>heroicons-outline:arrow-right</FuseSvgIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => onDelete(item)}>
            <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
          </IconButton>
        </Tooltip>
      </HoverActions>
    </Bubble>
  );
}

function renderTicks(status) {
  // simple ticks display similar to WA
  if (!status) return null;
  const map = {
    sent: "✓",
    delivered: "✓✓",
    read: "✓✓",
  };
  return (
    <span style={{ marginLeft: 6, opacity: 0.8 }}>{map[status] || ""}</span>
  );
}

function renderQuotedPreview(q) {
  switch (q.type) {
    case "text":
      return q.payload?.text?.body || q.preview || "Text";
    case "image":
      return "📷 Image";
    case "video":
      return "🎬 Video";
    case "audio":
      return "🎵 Audio";
    case "document":
      return q.payload?.document?.filename || "📎 Document";
    case "location":
      return "📍 Location";
    case "contacts":
      return "👤 Contact";
    case "interactive":
      return "🔘 Interactive";
    case "template":
      return `🧩 ${q.payload?.template?.name || "Template"}`;
    default:
      return "Message";
  }
}

// Dialog for choosing a template + variables (simple demo)

function AttachmentMenu({
  anchorEl,
  onClose,
  onPickFile,
  onPickImage,
  onPickAudio,
  onPickVideo,
  onPickDoc,
  onPickLocation,
  onPickContact,
  onPickTemplate,
}) {
  const open = Boolean(anchorEl);
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} elevation={3}>
      <MenuItem
        onClick={() => {
          onPickImage?.();
          onClose();
        }}
      >
        <FuseSvgIcon className="text-20" sx={{ mr: 1 }}>
          heroicons-outline:photograph
        </FuseSvgIcon>{" "}
        Image
      </MenuItem>
      <MenuItem
        onClick={() => {
          onPickVideo?.();
          onClose();
        }}
      >
        <FuseSvgIcon className="text-20" sx={{ mr: 1 }}>
          heroicons-outline:video-camera
        </FuseSvgIcon>{" "}
        Video
      </MenuItem>
      <MenuItem
        onClick={() => {
          onPickAudio?.();
          onClose();
        }}
      >
        <FuseSvgIcon className="text-20" sx={{ mr: 1 }}>
          heroicons-outline:music-note
        </FuseSvgIcon>{" "}
        Audio
      </MenuItem>
      <MenuItem
        onClick={() => {
          onPickDoc?.();
          onClose();
        }}
      >
        <FuseSvgIcon className="text-20" sx={{ mr: 1 }}>
          heroicons-outline:paper-clip
        </FuseSvgIcon>{" "}
        Document
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          onPickLocation?.();
          onClose();
        }}
      >
        <FuseSvgIcon className="text-20" sx={{ mr: 1 }}>
          heroicons-outline:location-marker
        </FuseSvgIcon>{" "}
        Location
      </MenuItem>
      <MenuItem
        onClick={() => {
          onPickContact?.();
          onClose();
        }}
      >
        <FuseSvgIcon className="text-20" sx={{ mr: 1 }}>
          heroicons-outline:user
        </FuseSvgIcon>{" "}
        Contact
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          onPickTemplate?.();
          onClose();
        }}
      >
        <FuseSvgIcon className="text-20" sx={{ mr: 1 }}>
          heroicons-outline:template
        </FuseSvgIcon>{" "}
        Template
      </MenuItem>
    </Menu>
  );
}

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

    ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            console.log('Connected to WebSocket server');
            // Register the user once connected
            ws.current.send(JSON.stringify({
                type: 'register',
                payload: { userId: contactId, contactId: contactId }
            }));
        };
    dispatch(getChat(contactId));

  }, [contactId, dispatch]);

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

  const grouped = useMemo(() => chat || [], [chat]);

  function isFirstMessageOfGroup(item, i) {
    return (
      i === 0 ||
      (grouped[i - 1] &&
        grouped[i - 1].messageOriginType !== item.messageOriginType)
    );
  }

  function isLastMessageOfGroup(item, i) {
    return (
      i === grouped.length - 1 ||
      (grouped[i + 1] &&
        grouped[i + 1].messageOriginType !== item.messageOriginType)
    );
  }

  function shouldShowDateSeparator(currentItem, previousItem) {
    if (!previousItem) return true;
    const currentDate = new Date(
      currentItem.dateCreated ||
        currentItem.messageTime ||
        currentItem.createdAt
    );
    const previousDate = new Date(
      previousItem.dateCreated ||
        previousItem.messageTime ||
        previousItem.createdAt
    );
    return currentDate.toDateString() !== previousDate.toDateString();
  }

  function formatMessageDate(item) {
    const date = new Date(
      item.dateCreated || item.messageTime || item.createdAt || Date.now()
    );
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  }

  function onInputChange(ev) {
    setMessageText(ev.target.value);
  }

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
