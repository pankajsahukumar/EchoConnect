import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import DownloadIcon from "@mui/icons-material/Download";
const DocumentContainer = styled(Box)(({ isMine }) => ({
  backgroundColor: "rgba(0, 168, 132, 0.1)",
  borderRadius: "7.5px",
  padding: "8px 12px",
  display: "flex",
  cursor: "pointer",
  maxWidth: "100%",
  "&:hover": {
    backgroundColor: "rgba(0, 168, 132, 0.15)",
  },
}));
const BubbleContainer = styled(Box)(({ isMine }) => ({
  maxWidth: "320px",
  display: "flex",
  flexDirection:"column",
  alignItems: "center",
  borderRadius: "10px",
  backgroundColor: isMine ? "#dcf8c6" : "#ffffff",
  position: "relative",
  cursor: "pointer",
  boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
  "&:hover": {
    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
  },
}));

const FileInfo = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  marginLeft: "10px",
  overflow: "hidden",
}));

const FileName = styled(Typography)(() => ({
  fontSize: "14px",
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const FileSize = styled(Typography)(() => ({
  fontSize: "12px",
  color: "#667781",
  marginTop: "2px",
}));

const TimeStamp = styled(Typography)(() => ({
  fontSize: "11px",
  color: "#667781",
  marginLeft: "auto",
  marginTop: "4px",
  paddingRight:"10px"
}));

const DocumentMessage = ({ message, isMine }) => {
  const createdAt = message.dateCreated
    ? new Date(message.dateCreated)
    : message.messageTime
    ? new Date(message.messageTime)
    : message.createdAt
    ? new Date(message.createdAt)
    : new Date();
  const timeString = createdAt.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = message.fileUrl;
    link.download = message.fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const getFileIcon = (fileName) => {
    if (!fileName)
      return <DescriptionIcon sx={{ fontSize: 40, color: "#00A884" }} />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf")
      return <PictureAsPdfIcon sx={{ fontSize: 40, color: "#D93025" }} />;
    if (["jpg", "jpeg", "png"].includes(ext))
      return <ImageIcon sx={{ fontSize: 40, color: "#1A73E8" }} />;
    if (["doc", "docx"].includes(ext))
      return <ArticleIcon sx={{ fontSize: 40, color: "#00A884" }} />;
    return <DescriptionIcon sx={{ fontSize: 40, color: "#00A884" }} />;
  };
  return (
    <BubbleContainer isMine={isMine} onClick={handleDownload}>
      <DocumentContainer>
        {getFileIcon(message.fileName)}
        <FileInfo>
          <FileName>{message.fileName || "Untitled"}</FileName>
          {message.size && <FileSize>{message.fileSize}</FileSize>}
        </FileInfo>
        <IconButton
          size="small"
          onClick={handleDownload}
          sx={{ color: "#00a884", marginLeft: "8px" }}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
      </DocumentContainer>

      <TimeStamp>{timeString}</TimeStamp>
    </BubbleContainer>
  );
};

export default DocumentMessage;
