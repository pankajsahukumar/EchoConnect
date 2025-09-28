import { Box, IconButton, InputBase, Typography, Paper } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useRef, useState } from "react";
import AttachmentMenu from "./AttachmentMenu";
import { ChatMessageModel } from "@models";
import { addTempMessage, sendMessage } from "../../store/chatSlice";
import { useSelector } from "react-redux";
import { selectCustomer } from "../../store/customerSlice";
import { useDispatch } from "react-redux";
import { apiClient } from "src/@api/utils/apiClient";

export default function MessageInput({
  messageText,
  setMessageText,
  quote,
  setQuote,
  inputRef,
  setAnchorEl,
  setTemplateOpen,
  anchorEl,
}) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const dispatch = useDispatch();
  const customer = useSelector(selectCustomer);
  async function onMessageSubmit(ev) {
    ev.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed) return;

    try {
      const messageData = new ChatMessageModel(
        customer.id,
        { messageType: "text", text: trimmed },
        quote ? quote.id : null,
        customer
      );
      dispatch(addTempMessage(messageData.toTempMessage(quote)));
      // Always clear input and quote after attempting to send
      setMessageText("");
      setQuote(null);

      const resultAction = await dispatch(sendMessage(messageData));

      // Check if the message was sent successfully
      if (sendMessage.fulfilled.match(resultAction)) {
        console.log("Message sent successfully:", resultAction.payload);
      } else {
        console.error("Failed to send message:", resultAction.error);
      }
    } catch (error) {
      setMessageText("");
      setQuote(null);
    }
  }

  const onMessageSubmitV2 = () => {
    let trimmed = messageText.trim();
    if (!trimmed && files.length <= 0) return;
    let MessageList = [];
    console.log(trimmed, "this is file information", files);
    if (files.length <= 0) {
      const messageData = new ChatMessageModel(
        customer.id,
        { messageType: "text", text: trimmed },
        quote ? quote.id : null,
        customer
      );
      MessageList.push(messageData);
    } else {
      MessageList = files.map((f) => {
  
        let message = {
          messageType: f.fileType,
          fileUrl:f.fileUrl,
               caption: trimmed,
          mimeType: f.type,
          size: f.size,
          fileName: f.fileName,
        };
        trimmed = "";
        const messageData = new ChatMessageModel(
          customer.id,
          message,
          quote ? quote.id : null,
          customer
        );
        return messageData;
      });
      console.log(MessageList, "this is Message List");
    }

    try {
      MessageList.map(async (message) => {
        dispatch(addTempMessage(message.toTempMessage(quote)));
        const resultAction = await dispatch(sendMessage(message));

        // Check if the message was sent successfully
        if (sendMessage.fulfilled.match(resultAction)) {
          console.log("Message sent successfully:", resultAction.payload);
        } else {
          console.error("Failed to send message:", resultAction.error);
        }
      });
      // Always clear input and quote after attempting to send
      setMessageText("");
      setQuote(null);
    } catch (error) {
      setMessageText("");
      setQuote(null);
    }
  };
  const onInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };
  const handlePickDocument = () => {
    fileInputRef2.current?.click();
  };

  const handleFileChange = async (event, type = "document") => {
    const newFiles = Array.from(event.target.files);

    // Process each file one by one
    for (const file of newFiles) {
      console.log(file, "this is file", type);
      let fileType = type;
      try {
        if (type == "image" && file.type.startsWith("video")) {
          fileType = "video";
        }
        // 1. Ask your backend for a presigned URL
        const response = await apiClient.get("/api/get/url", {
          fileName: file.name,
          fileType: file.type,
        });

        const { signedUrl, fileUrl } = response.data;
        // 2. Upload directly to S3
        await fetch(signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        // 3. Store both local preview + remote S3 URL
        const uploadedFile = {
          fileType: fileType,
          fileUrl:fileUrl,
          mimeType: file.type,
          size: file.size,
          fileName: file.name,
          preview:URL.createObjectURL(file)
        };
        setFiles((prev) => [...prev, uploadedFile]);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }

    event.target.value = null; // reset file input
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can upload all files using presigned URLs
    // For now just log them
    console.log("Sending message:", messageText, files);
    onMessageSubmitV2();
    // onMessageSubmit(e);
    // onMessageSubmit({
    //   text: messageText,
    //   attachments: files.map((f) => f.file),
    // });

    // Reset
    setMessageText("");
    setFiles([]);
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
        borderTop: "1px solid #e4e6ea",
        padding: "10px 16px",
        zIndex: 100,
      }}
    >
      {/* Preview gallery */}
      {/* Preview gallery */}
      {files.length > 0 && (
        <Box
          sx={{
            mb: 1,
          }}
        >
          {files.map((f, i) => (
            <Paper
              key={i}
              sx={{
                position: "relative",
                width: "100%",
                height: "50%",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ccc",
                mb: 1,
              }}
            >
              <img
                src={f.preview}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <IconButton
                size="small"
                onClick={() => handleRemoveFile(i)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
              >
                <FuseSvgIcon size={18}>heroicons-outline:x-mark</FuseSvgIcon>
              </IconButton>
            </Paper>
          ))}

          {/* Add more button below */}
          <Box
            onClick={handlePickImage}
            sx={{
              width: "100%",
              height: 120,
              borderRadius: 2,
              border: "2px dashed #aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FuseSvgIcon size={32} color="action">
              heroicons-outline:plus
            </FuseSvgIcon>
          </Box>
        </Box>
      )}

      {/* Input Area */}
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
          ref={inputRef}
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

        <input
          ref={fileInputRef}
          type="file"
          accept="
    image/*,
    video/*,
  "
          style={{ display: "none" }}
          multiple
          onChange={(ev) => {
            handleFileChange(ev, "image");
          }}
        />
        <input
          ref={fileInputRef2}
          type="file"
          accept="
    .txt,.stream,.bin,.pdf,.docx,.doc,.ppt,.pptx,.xls,.xlsx,.cdr,
          .jpg,.jpeg,.png,.webp,
          .mp4,.3gp,
          .aac,.mp3,.m4a,.mpeg,.amr,.ogg,.opus
  "
          style={{ display: "none" }}
          multiple
          onChange={(ev) => {
            handleFileChange(ev, "document");
          }}
        />

        <IconButton
          type="submit"
          disabled={!messageText.trim() && files.length === 0}
          sx={{
            width: 40,
            height: 40,
            backgroundColor:
              messageText.trim() || files.length > 0
                ? "#00a884"
                : "transparent",
            color: messageText.trim() || files.length > 0 ? "#fff" : "#8696a0",
          }}
        >
          <FuseSvgIcon size={20} sx={{ transform: "rotate(90deg)" }}>
            heroicons-solid:paper-airplane
          </FuseSvgIcon>
        </IconButton>
      </Box>

      <AttachmentMenu
        setAnchorEl={setAnchorEl}
        setTemplateOpen={setTemplateOpen}
        anchorEl={anchorEl}
        handlePickImage={handlePickImage}
        handlePickDocument={handlePickDocument}
      />
    </Box>
  );
}
