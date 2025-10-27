import { Box, IconButton, InputBase, Typography, Paper } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import { addTempMessage, sendMessage } from "../store/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChatMessageModel } from "@models";
import { selectCustomer } from "../store/customerSlice";
import Attachments from "./Attachments";
import MessageInputV2 from "./MessgeInputV2";

export default function MessageSender() {
  const [messageText, setMessageText] = useState("");
  const customer = useSelector(selectCustomer);
  const [quote, setQuote] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);


  const dispatch = useDispatch();
  const onMessageSubmitV2 = async () => {
    let trimmed = messageText.trim();
    const messageData = new ChatMessageModel(
      customer.chatId,
      { messageType: "text", text: trimmed },
      quote ? quote.id : null,
      customer
    );
    dispatch(addTempMessage(messageData.toTempMessage(null)));
    const resultAction = await dispatch(sendMessage(messageData));
    if (sendMessage.fulfilled.match(resultAction)) {
      console.log("Message sent successfully:", resultAction.payload);
    } else {
      console.error("Failed to send message:", resultAction.error);
    }
    setMessageText("");
    setQuote(null);
  };
  const onInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSubmitV2();

    setMessageText("");
  };

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        backgroundColor: "#f0f2f5",
        padding: "5px 8px 5px 12px",
        borderTop: "1px solid #e4e6ea"
        
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "5px 8px 5px 12px",
          border: "1px solid #e4e6ea",
        }}
      >
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <FuseSvgIcon>heroicons-outline:paper-clip</FuseSvgIcon>
        </IconButton>
        <InputBase
          multiline
          maxRows={5}
          placeholder="Type a message"
          value={messageText}
          onChange={onInputChange}
          sx={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <IconButton
          type="submit"
          disabled={!messageText.trim()}
          sx={{
            width: 40,
            height: 40,
            backgroundColor: messageText.trim() ? "#00a884" : "transparent",
            color: messageText.trim() ? "#fff" : "#8696a0",
            '&:hover': {
              backgroundColor: messageText.trim() ? "#00a884" : "transparent", // no hover color change
              color: messageText.trim() ? "#fff" : "#8696a0", // keep icon white
            },
            '&:focus': {
              backgroundColor: messageText.trim() ? "#00a884" : "transparent",
            },
            '&:active': {
              backgroundColor: messageText.trim() ? "#00a884" : "transparent",
            },
          }}
          disableRipple
          disableFocusRipple
        >
          <FuseSvgIcon size={20} sx={{ transform: "rotate(90deg)" }}>
            heroicons-solid:paper-airplane
          </FuseSvgIcon>
        </IconButton>
      </Box>

      <Attachments
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
      />
    </Box>
  );
}
