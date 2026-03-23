import React from "react";
import styled from "@emotion/styled";

const TimeStamp = styled("div")({
  fontSize: "11px",
  color: "#667781", // WhatsApp-like gray
  fontWeight: 400,
  lineHeight: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "3px",
  marginTop: "4px",
  userSelect: "none",
});

const MessageTimeStamp = ({ message, isRead }) => {
  const createdAt =
    message?.dateCreated
      ? new Date(message.dateCreated)
      : message?.messageTime
      ? new Date(message.messageTime)
      : message?.createdAt
      ? new Date(message.createdAt)
      : new Date();

  const timeString = createdAt.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TimeStamp>
      <span>{timeString}</span>
      {/* {isRead ? (
        <CheckCheck size={14} color="#53bdeb" />
      ) : (
        <Check size={14} color="#667781" />
      )} */}
    </TimeStamp>
  );
};

export default MessageTimeStamp;
