import {
    Box,
    IconButton,
    InputBase,
    Divider,
    Typography,
    Menu,
    MenuItem,
  } from "@mui/material";
  import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AttachmentMenu from "./AttachmentMenu";
  
  export default function MessageInput({
    messageText,
    setMessageText,
    quote,
    setQuote,
    onMessageSubmit,
    inputRef,
    fileInputRef,
    handleFileChange,
    setAnchorEl,
    setTemplateOpen,
    anchorEl,
    handlePickImage, // ✅ make sure you pass this prop from parent
  }) {
    // ✅ Added missing input change handler
    const onInputChange = (e) => {
      setMessageText(e.target.value);
    };
  
    return (
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#f0f2f5",
          borderTop: "1px solid #e4e6ea",
          padding: "10px 16px",
          zIndex: 100,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Reply Preview */}
        {quote && (
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "7.5px",
              padding: "8px 12px",
              marginBottom: "8px",
              borderLeft: "4px solid #00a884",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#00a884",
                  fontWeight: 500,
                  fontSize: "12.8px",
                  display: "block",
                  lineHeight: "16px",
                }}
              >
                Replying to {quote.authorName || "Contact"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#667781",
                  fontSize: "13px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: "18px",
                }}
              >
                {quote.preview}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setQuote(null)}
              sx={{
                color: "#8696a0",
                marginLeft: "8px",
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                  color: "#54656f",
                },
              }}
            >
              <FuseSvgIcon size={18}>heroicons-outline:x-mark</FuseSvgIcon>
            </IconButton>
          </Box>
        )}
  
        {/* Input Area */}
        <Box
          component="form"
          onSubmit={onMessageSubmit}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "5px 8px 5px 12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            border: "1px solid #e4e6ea",
            width: "100%",
            boxSizing: "border-box",
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onMessageSubmit(e);
              }
            }}
            sx={{
              flex: 1,
              fontSize: "15px",
              lineHeight: "20px",
              color: "#3b4a54",
              minHeight: "20px",
              "& .MuiInputBase-input": {
                padding: "9px 0",
                resize: "none",
                "&::placeholder": {
                  color: "#8696a0",
                  opacity: 1,
                },
              },
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
  
          {/* Send Button */}
          <IconButton
            type="submit"
            disabled={!messageText.trim()}
            sx={{
              width: "40px",
              height: "40px",
              minWidth: "40px",
              backgroundColor: messageText.trim() ? "#00a884" : "transparent",
              color: messageText.trim() ? "#ffffff" : "#8696a0",
              flexShrink: 0,
              "&:hover": {
                backgroundColor: messageText.trim()
                  ? "#008069"
                  : "rgba(0,0,0,0.05)",
              },
              "&:disabled": {
                backgroundColor: "transparent",
                color: "#8696a0",
              },
              transition: "all 0.2s ease",
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
        />
      </Box>
    );
  }
  