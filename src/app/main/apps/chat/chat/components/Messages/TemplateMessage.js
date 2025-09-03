import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextComponent from "./TextComponent";

const TemplateContainer = styled(Box)(({ isMine }) => ({
  maxWidth: 320,
  backgroundColor: isMine ? "#d9fdd3" : "#fff",
  borderRadius: "7.5px",
  overflow: "hidden",
  fontFamily:
    "Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif",
  position: "relative",
  marginBottom: "0px",
}));

const SenderName = styled("div")({
  color: "#00a884",
  fontSize: "12.8px",
  fontWeight: 500,
  marginBottom: "4px",
  padding: "8px 12px 0 12px",
});

const TemplateContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "transparent",
});

const TemplateMedia = styled("img")({
  width: "100%",
  height: "auto",
  maxHeight: "350px",
  objectFit: "cover",
  borderRadius: "7.5px",
  paddingLeft: "2px",
  paddingRight: "2px",
});
const TemplateVideoMedia = styled("video")({
  width: "100%",
  height: "auto",
  maxHeight: "500px",
  objectFit: "cover",
  borderRadius: "7.5px",
  paddingLeft: "2px",
  paddingRight: "2px",
});

const TemplateTextContent = styled(Box)({
  "& a": {
    color: "#039be5",
    textDecoration: "underline",
  },
  "& strong": {
    fontWeight: 600,
  },
  "& em": {
    fontStyle: "italic",
  },
  "& pre": {
    fontFamily: "monospace",
    backgroundColor: "#f0f2f5",
    padding: "4px 8px",
    borderRadius: "4px",
    margin: "4px 0",
  },
  padding: "8px 12px",
  "& .template-text": {
    fontSize: "14px",
    lineHeight: "19px",
    color: "#111b21",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    marginBottom: "6px",
    "&:last-child": { marginBottom: 0 },
  },
});

// Line clamp CSS (10 lines max)
const lineClampStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 10,
};

const TemplateButtonBox = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderTop: "1px solid rgba(189, 216, 200, 0.5)",
  position: "relative",
});

const CopyToast = styled(Box)({
  position: "absolute",
  bottom: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "4px",
  fontSize: "12px",
  marginBottom: "8px",
  zIndex: 1000,
  animation: "fadeInOut 2s ease-in-out",
  "@keyframes fadeInOut": {
    "0%": { opacity: 0 },
    "10%": { opacity: 1 },
    "90%": { opacity: 1 },
    "100%": { opacity: 0 }
  }
});

const TemplateButton = styled(Button)({
  width: "100%",
  backgroundColor: "transparent",
  color: "rgb(0, 157, 226)",
  borderRadius: 0,
  padding: "10px 12px",
  fontSize: "14px",
  fontWeight: 500,
  textTransform: "none",
  "&:hover": { backgroundColor: "rgba(0, 168, 132, 0.05)" },
});

const ButtonComponent = ({ button, maxVisibleButtons = 3 }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [copySuccess, setCopySuccess] = useState('');

  const handleButtonClick = (btn) => {
    if (btn.type === "URL" && btn.url) window.open(btn.url, "_blank");
    if (btn.type === "PHONE_NUMBER" && btn.phoneNumber) window.open(`tel:${btn.phoneNumber}`);
    if (btn.type === "QUICK_REPLY") console.log("Quick Reply clicked:", btn.text);
    if (btn.type === "OTP" && btn.otp_type === "COPY_CODE") {
      navigator.clipboard.writeText(btn.otp).then(() => {
        setCopySuccess('Code copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      }).catch(err => {
        console.error('Failed to copy code:', err);
        setCopySuccess('Failed to copy code');
      });
    }
    handleClose();
  };

  if (!button?.data || button.data.length === 0) return null;

  const visibleButtons = button.data.slice(0, maxVisibleButtons);
  const overflowButtons = button.data.slice(maxVisibleButtons);

  return (
    <TemplateButtonBox>
      {copySuccess && <CopyToast>{copySuccess}</CopyToast>}
      {visibleButtons.map((btn, idx) => (
        <TemplateButton key={idx} onClick={() => handleButtonClick(btn)}>
          {btn.type === "URL" ? "🔗 " : btn.type === "PHONE_NUMBER" ? "📞 " : ""}
          {btn.text}
        </TemplateButton>
      ))}
      {overflowButtons.length > 0 && (
        <>
          <TemplateButton onClick={handleClick}>
            More options ({overflowButtons.length})
          </TemplateButton>
          <Box
            component="div"
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: open ? "flex" : "none",
              justifyContent: "center",
              alignItems: "flex-end",
              zIndex: 1000,
            }}
            onClick={handleClose}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                width: "100%",
                maxWidth: 320,
                borderRadius: "12px 12px 0 0",
                overflow: "hidden",
                marginBottom: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {overflowButtons.map((btn, idx) => (
                <TemplateButton key={idx} onClick={() => handleButtonClick(btn)}>
                  {btn.type === "URL" ? "🔗 " : btn.type === "CALL" ? "📞 " : ""}
                  {btn.text}
                </TemplateButton>
              ))}
              <TemplateButton onClick={handleClose} sx={{ color: "#ef5350" }}>
                Cancel
              </TemplateButton>
            </Box>
          </Box>
        </>
      )}
    </TemplateButtonBox>
  );
};

const TimeStamp = styled("div")({
  fontSize: "11px",
  color: "#667781",
  fontWeight: 400,
  marginTop: "4px",
  float: "right",
  lineHeight: "15px",
});

const MessageTailSvg = ({ isMine }) => (
  <svg
    viewBox="0 0 8 13"
    width="8"
    height="13"
    style={{
      position: "absolute",
      bottom: 0,
      right: isMine ? -8 : "auto",
      left: isMine ? "auto" : -8,
      transform: isMine ? "scaleX(-1)" : "none",
    }}
  >
    <path
      fill={isMine ? "#d9fdd3" : "#ffffff"}
      d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
    />
  </svg>
);

const TemplateMessageHeader = ({ header }) => {
  if (!header || !header.data || header.data.length === 0) {
    return null;
  }
  let HeaderData = [...header.data];
  return (
    <div>
      {HeaderData.map((item, index) => {
        if (item.type !== "text") {
          console.log("different type", item);
        }
        return (
          <div key={index}>
            {item.type === "text" && (
              <TemplateTextContent>
                <Typography
                  className="template-text"
                  style={{ fontWeight: 600 }}
                >
                  {item.text}
                </Typography>
              </TemplateTextContent>
            )}
            {(item.type === 'image' || item.type === 'video') && item?.link && (
              <div className="media-container">
                {item.type === 'image' ? (
                  <TemplateMedia
                    src={item.link}
                    alt="header"
                  />
                ) : (
                  <TemplateVideoMedia controls>
                    <source src={item.link} type="video/mp4" />
                    Your browser does not support the video tag.
                  </TemplateVideoMedia>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const TemplateMessage = ({ message, isMine = false, senderName }) => {
  const [expanded, setExpanded] = useState(false);

  const template = message?.payload?.template || message?.templateMessage;
  if (!template) return null;

  const { header, body, footer, button } = template;
  const bodyText = body?.text || body?.data?.[0]?.text;
  const footerText = footer?.text || footer?.data?.[0]?.text;

  const createdAt = message?.dateCreated || message?.messageTime || new Date();
  const timeString = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <TemplateContainer isMine={isMine}>
      {!isMine && senderName && <SenderName>{senderName}</SenderName>}

      <TemplateContent>
        {/* Header */}
        <TemplateMessageHeader header={header} />

        {/* Body */}
        {bodyText && (
          <TemplateTextContent>
            <Typography
              className="template-text"
              style={!expanded ? lineClampStyle : {}}
            >
              <TextComponent text={bodyText} />
            </Typography>

            {bodyText.split(/\s+/).length > 20 && (
              <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  fontSize: "12px",
                  textTransform: "none",
                  padding: 0,
                  marginTop: "4px",
                  color: "#009de2",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                {!expanded && "Read More"}
              </Button>
            )}
          </TemplateTextContent>
        )}

        {/* Footer */}
        {footerText && (
          <TemplateTextContent>
            <Typography
              className="template-text"
              style={{ fontSize: "12px", color: "#667781" }}
            >
              {footerText}
              <TimeStamp>
                {timeString}{" "}
                {isMine && <span style={{ color: "#00a884" }}>✓✓</span>}
              </TimeStamp>
            </Typography>
          </TemplateTextContent>
        )}

        {/* Buttons */}
        <ButtonComponent button={button} maxVisibleButtons={3} />
      </TemplateContent>

      <MessageTailSvg isMine={isMine} />
    </TemplateContainer>
  );
};

export default TemplateMessage;
