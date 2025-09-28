import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { IconButton, Menu, MenuItem } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import TemplateMessage from "./TemplateMessage";
import TextMessage from "./TextMessage";
import SystemMessage from "./SystemMessage";
import QuotedMessage from "./QuotedMessage";
import ImageMessage from "./ImageMessage";
import InteractiveMessage from "./InteractiveMessage";
import ButtonMessage from "./ButtonMessage";
import DocumentMessage from "./DocumentMessage";
const StyledMessageRow = styled("div")(() => ({
  display: "flex",
  width: "100%",
  marginBottom: 1,
  padding: "0 2% 0 2%",

  "&.contact": {
    justifyContent: "flex-start",
    "& .bubble, & > *": {
      backgroundColor: "#ffffff",
      color: "#111b21",
      borderRadius: "7.5px",
      boxShadow: "0 1px 0.5px rgba(11,20,26,.13)",
      maxWidth: "65%",
      position: "relative",
      margin: "0 0 2px 0",
    },
  },

  "&.me": {
    justifyContent: "flex-end",
    "& .bubble, & > *": {
      backgroundColor: "#d9fdd3",
      color: "#111b21",
      borderRadius: "7.5px",
      boxShadow: "0 1px 0.5px rgba(11,20,26,.13)",
      maxWidth: "65%",
      position: "relative",
      margin: "0 0 2px 0",
    },
  },

  "&.contact + .me, &.me + .contact": {
    marginTop: 12,
  },
}));

const MessageWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "highlighted",
})(({ highlighted }) => ({
  position: "relative",
  transition: "all 0.2s ease",
  borderRadius: "7.5px",
  margin: "1px 0",
  ...(highlighted && {
    backgroundColor: "rgba(0, 168, 132, 0.15)",
    animation: "highlight-pulse 2s ease-out",
  }),
  "&:hover .hover-arrow": {
    display: "flex",
  },
  "@keyframes highlight-pulse": {
    "0%": { backgroundColor: "rgba(0, 168, 132, 0.35)" },
    "100%": { backgroundColor: "transparent" },
  },
}));

// WhatsApp-like down arrow
const HoverArrow = styled("div")(({ isMine }) => ({
  position: "absolute",
  top: "3px",
  right: "3px" ,
  display: "none",
  zIndex: 1000,
  "& .MuiIconButton-root": {
    width: "28px",
    height: "28px",
    color: "#54656f",
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
  },
}));

const RenderMessage = ({
  message,
  messageType,
  messageOriginType,
  isMine,
  senderName,
  messageId,
  quote,
  highlightedMessageId,
  onReply,
  onCopy,
  onForward,
  onDelete,
  onEmojiSelect,
  onQuoteClick,
  setHighlightedMessageId, // 👈 pass this from parent
  Data
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  if (messageOriginType === "SYSTEM") {
    return <SystemMessage message={message} />;
  }

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const getMessagePreview = (msg, type) => {
    switch (type) {
      case "template":
        const template = msg?.templateMessage || msg?.payload?.template;
        return (
          template?.body?.data?.[0]?.text ||
          template?.body?.text ||
          "Template message"
        );
      case "text":
        return (
          msg?.text ||
          msg?.payload?.text?.body ||
          msg?.interactiveMessage?.body?.text ||
          "Text message"
        );
      case "interactive":
        return msg?.interactiveMessage?.body?.text || "Interactive message";
      default:
        return "Message";
    }
  };

  const renderMessageContent = () => {
    switch (messageType) {
      case "template":
        return (
          <TemplateMessage
            message={message}
            isMine={isMine}
            senderName={senderName}
          />
        );
      case "text":
        return (
          <TextMessage
            message={message}
            isMine={isMine}
            senderName={senderName}
          />
        );
      case "button":
        return (
          <ButtonMessage
            message={message}
            isMine={isMine}
            senderName={senderName}
          />
        );
        case "image":
          console.log(message,"this istyep image","image")
          return (
            <ImageMessage
              message={message}
              isMine={isMine}
              senderName={senderName}
            />
          );
      case "interactive":
        return (
          <InteractiveMessage
            message={message}
            isMine={isMine}
            senderName={senderName}
          />
        );
      case "audio":
        return (
          <AudioMessage
            message={message}
            isMine={isMine}
            senderName={senderName}
          />
        );
      case "document":
        return (
          <DocumentMessage
            message={message}
            isMine={isMine}
            senderName={senderName}
          />
        );
      case "video":
        return (
          <VideoMessage
            message={message}
            isMine={isMine}
            senderName={senderName}
          />
        );
      default:
        console.log("Unsupported message type:", messageType);
        return null;
      
    }
  };

  const highlightMessage = (id) => {
    // set id in parent so it gets highlighted
    setHighlightedMessageId?.(id);
    // auto remove after 2s like WhatsApp
    setTimeout(() => {
      setHighlightedMessageId?.(null);
    }, 2000);

    // also scroll into view
    const el = document.getElementById(`message-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <StyledMessageRow
      className={isMine ? "me" : "contact"}
      id={`message-${messageId}`}
    >
      <MessageWrapper highlighted={highlightedMessageId === messageId}>
        
        {quote && (
          <QuotedMessage
            quote={quote}
            isMine={isMine}
            onQuoteClick={(q) => {
              highlightMessage(q.id); // 👈 highlight when clicking quoted message
              onQuoteClick?.(q);
            }}
          />
        )}

        {/* WhatsApp-style hover arrow */}
        <HoverArrow isMine={isMine} className="hover-arrow">
          <IconButton size="small" onClick={handleMenuClick}>
            <FuseSvgIcon size={16}>heroicons-outline:chevron-down</FuseSvgIcon>
          </IconButton>
        </HoverArrow>

        {/* Dropdown Menu */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onReply?.({
                quoted: {
                  id: messageId,
                  type: messageType,
                  preview: getMessagePreview(message, messageType),
                  authorName: senderName || (isMine ? "You" : "Contact"),
                },
              });
              highlightMessage(messageId); // 👈 highlight when replying
              handleMenuClose();
            }}
          >
            Reply
          </MenuItem>
          <MenuItem
            onClick={() => {
              onForward?.(message);
              handleMenuClose();
            }}
          >
            Forward
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete?.(message);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>

        {/* Actual message content */}
        {renderMessageContent()}

     {/* <TemplateMessage message={dummyTemplate} isMine={false} /> */}
      </MessageWrapper>
    </StyledMessageRow>
  );
};

export default RenderMessage;
