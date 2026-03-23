import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import styled from "styled-components";

// Styles
const MessageTextWrapper = styled(Box)({
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
    "& .message-text": {
      fontSize: "14px",
      lineHeight: "19px",
      color: "#111b21",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      marginBottom: "6px",
      "&:last-child": { marginBottom: 0 },
    },
  });
  
  // Component
  const MessageTextBlock = ({
    children,
    variant = "body", // "body" | "header" | "footer"
    bold = false,
    color,
    fontSize,
    style = {},
  }) => {
    let variantStyle = {};
  
    switch (variant) {
      case "header":
        variantStyle = { fontWeight: 600, fontSize: "15px" };
        break;
      case "footer":
        variantStyle = { fontSize: "12px", color: "#667781" };
        break;
      case "body":
      default:
        variantStyle = { fontSize: "14px", color: "#111b21" };
        break;
    }
  
    if (bold) variantStyle.fontWeight = 600;
    if (color) variantStyle.color = color;
    if (fontSize) variantStyle.fontSize = fontSize;
  
    return (
      <MessageTextWrapper>
        <Typography
          className="message-text"
          style={{ ...variantStyle, ...style }}
        >
          {children}
        </Typography>
      </MessageTextWrapper>
    );
  };
  
  export default MessageTextBlock;
  