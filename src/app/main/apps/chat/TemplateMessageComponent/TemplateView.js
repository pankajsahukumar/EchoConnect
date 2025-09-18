import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import MessageTextBlock from "../chat/components/TemplateMessage/MessageTextBlock";
import TextComponent from "../chat/components/Messages/TextComponent";
import HeaderVideo from "../chat/components/TemplateMessage/HeaderVideo";
import HeaderImage from "../chat/components/TemplateMessage/HeaderImage";
import HeaderDocument from "../chat/components/TemplateMessage/HeaderDocument";
import ButtonComponent from "../chat/components/TemplateMessage/ButtonComponent";

const TemplateForm = ({ template }) => {
  const header = template.components.find((c) => c.type === "HEADER");
  const body = template.components.find((c) => c.type === "BODY");
  const footer = template.components.find((c) => c.type === "FOOTER");
  const buttons =
    template.components.find((c) => c.type === "BUTTON")?.buttons || [];
  // Extract variables from text fields (body + header + buttons)
  const extractVariables = (text = "") => {
    const matches = text.match(/{{(.*?)}}/g) || [];
    return matches.map((m) => m.replace(/[{}]/g, ""));
  };

  const variables = useMemo(() => {
    let vars = [];
    if (body?.text) vars = [...vars, ...extractVariables(body.text)];
    if (header?.format === "TEXT" && header.text)
      vars = [...vars, ...extractVariables(header.text)];
    buttons.forEach((btn) => {
      if (btn.text) vars = [...vars, ...extractVariables(btn.text)];
      if (btn.url) vars = [...vars, ...extractVariables(btn.url)];
    });
    return [...new Set(vars)]; // unique
  }, [body, header, buttons]);

  const [formData, setFormData] = useState(
    template.components.reduce((acc, c) => {
      if (c.example) acc = { ...acc, ...c.example };
      if (c.buttons) {
        c.buttons.forEach((btn) => {
          if (btn.example) {
            if (typeof btn.example === "string") {
              acc[extractVariables(btn.url)[0]] = btn.example;
            } else {
              acc = { ...acc, ...btn.example };
            }
          }
        });
      }
      return acc;
    }, {})
  );

  // Handle change for variables and media
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Replace placeholders in text
  const renderText = (text = "") => {
    let out = text;
    variables.forEach((v) => {
      const val = formData[v] || `{{${v}}}`;
      out = out.replace(new RegExp(`{{${v}}}`, "g"), val);
    });
    return out;
  };
  console.log(template.components, "this is template info");

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="shadow-lg" style={{ margin: 0, padding: 0 }}>
        <CardContent>
          <RenderHeader header={header} />

          <RenderBody body={body} />
          <RenderFooter footer={footer} />

        </CardContent>

        <RenderButton buttons={buttons} />
      </Card>
    </div>
  );
};

export default TemplateForm;
const RenderHeader = ({ header }) => {
  if (!header) return null;
  return (
    <>
      <RenderHeaderFactory header={header} />
    </>
  );
};

const RenderHeaderFactory = ({ header }) => {
  console.log(header, "this is header");
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
      console.log(header, "other");
      return "Hi there";
  }
};
const RenderFooter = ({ footer }) => {
  if(footer)
  return <MessageTextBlock variant="footer">{footer.text}</MessageTextBlock>;
};
const RenderBody = ({ body }) => {
  const [expanded, setExpanded] = useState(false);

  const words = body.text.split(/\s+/);
  const shouldTruncate = words.length > 20;
  const displayText = expanded ? body.text : words.slice(0, 20).join(" ") + (shouldTruncate ? "..." : "");

  return (
    <MessageTextBlock variant="body">
      <TextComponent text={displayText} />

      {shouldTruncate && (
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
          {expanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </MessageTextBlock>
  );
};


const RenderButton = ({ buttons }) => {
  if(!buttons||buttons.length<1)
    return null;
  return (
    <>
    <ButtonComponent button={buttons}/>
    </>
  );
};
