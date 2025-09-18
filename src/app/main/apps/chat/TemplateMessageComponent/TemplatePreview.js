import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Button,
} from "@mui/material";
import MessageTextBlock from "../chat/components/TemplateMessage/MessageTextBlock";
import TextComponent from "../chat/components/Messages/TextComponent";
import HeaderVideo from "../chat/components/TemplateMessage/HeaderVideo";
import HeaderImage from "../chat/components/TemplateMessage/HeaderImage";
import HeaderDocument from "../chat/components/TemplateMessage/HeaderDocument";
import ButtonComponent from "../chat/components/TemplateMessage/ButtonComponent";

const TemplatePreview = ({ template }) => {
  const header = template.components.find((c) => c.type === "HEADER");
  const body = template.components.find((c) => c.type === "BODY");
  const footer = template.components.find((c) => c.type === "FOOTER");
  const buttons =
    template.components.find((c) => c.type === "BUTTON")?.buttons || [];
  console.table("hi there ",template)
  return (
    <div className="flex justify-start">
      <Card
        className="shadow-md rounded-2xl"
        style={{
          width: "350px",  
          margin: "0 auto",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CardContent style={{ padding: "12px" }}>
          <RenderHeader header={header} />
          <RenderBody body={body} />
          <RenderFooter footer={footer} />
        </CardContent>
        <RenderButton buttons={buttons} />
      </Card>
    </div>
  );
};

export default TemplatePreview;

// --- Helpers ---

const RenderHeader = ({ header }) => {
  if (!header) return null;
  return <RenderHeaderFactory header={header} />;
};

const RenderHeaderFactory = ({ header }) => {
  switch (header.format) {
    case "TEXT":
      return (
        <MessageTextBlock variant="header">{header.text}</MessageTextBlock>
      );
    case "VIDEO":
      return (
        <HeaderVideo
          link={header.example?.link}
          fileName={header.example?.fileName}
        />
      );
    case "IMAGE":
      return (
        <HeaderImage
          link={header.example?.link}
          alt_text={header.example?.fileName}
        />
      );
    case "DOCUMENT":
      return (
        <HeaderDocument
          link={header.example?.link}
          fileName={header.example?.fileName}
          thumbnailUrl={header.thumbnailUrl}
        />
      );
    default:
      return null;
  }
};

const RenderFooter = ({ footer }) => {
  if (!footer) return null;
  return <MessageTextBlock variant="footer">{footer.text}</MessageTextBlock>;
};

const RenderBody = ({ body }) => {
  const [expanded, setExpanded] = useState(false);

  const words = body.text.split(/\s+/);
  const shouldTruncate = words.length > 20;
  const displayText =
    expanded || !shouldTruncate
      ? body.text
      : words.slice(0, 20).join(" ") + "...";

  return (
    <MessageTextBlock variant="body">
      <TextComponent text={displayText} />

      {shouldTruncate && !expanded && (
        <div
          onClick={() => setExpanded(true)}
          style={{
            color: "#009de2",
            cursor: "pointer",
            marginTop: "4px", // 👈 spacing from text
            display: "block", // 👈 always new line
          }}
        >
          see more
        </div>
      )}
    </MessageTextBlock>
  );
};



const RenderButton = ({ buttons }) => {
  if (!buttons || buttons.length < 1) return null;
  return <ButtonComponent button={buttons} />;
};
