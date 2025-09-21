import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import MessageTextBlock from "../chat/components/TemplateMessage/MessageTextBlock";
import TextComponent from "../chat/components/Messages/TextComponent";
import HeaderVideo from "../chat/components/TemplateMessage/HeaderVideo";
import HeaderImage from "../chat/components/TemplateMessage/HeaderImage";
import HeaderDocument from "../chat/components/TemplateMessage/HeaderDocument";
import ButtonComponent from "../chat/components/TemplateMessage/ButtonComponent";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TemplatePreview = ({ template }) => {
  const header = template.components.find((c) => c.type === "HEADER");
  const body = template.components.find((c) => c.type === "BODY");
  const footer = template.components.find((c) => c.type === "FOOTER");
  const buttons =
    template.components.find((c) => c.type === "BUTTON")?.buttons || [];
    
  return (
    <div className="flex justify-start">
      <Box sx={{ width: "100%", maxWidth: 350 }}>
        {/* WhatsApp Header */}
        <Box sx={{ 
          bgcolor: "#128C7E", 
          color: "white", 
          p: 1, 
          display: "flex", 
          alignItems: "center",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}>
          <Avatar sx={{ bgcolor: "white", width: 30, height: 30, mr: 1 }}>
            <WhatsAppIcon sx={{ color: "#128C7E", fontSize: 20 }} />
          </Avatar>
          <Typography variant="subtitle2">WhatsApp Business</Typography>
        </Box>
        
        {/* Message Container */}
        <Box sx={{ bgcolor: "#f0f0f0", p: 1.5, borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}>
          {/* Timestamp */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Typography variant="caption" sx={{ bgcolor: "rgba(225,245,254,.92)", px: 1, py: 0.5, borderRadius: 1 }}>
              YESTERDAY, 10:30 PM
            </Typography>
          </Box>
          
          <Card
            className="shadow-md rounded-2xl"
            style={{
              width: "100%",  
              margin: "0 auto",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <CardContent style={{ padding: "12px" }}>
              <RenderHeader header={header} template={template} />
              <RenderBody body={body} template={template} />
              <RenderFooter footer={footer} template={template} />
              
              {/* Message time and status */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, alignItems: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontSize: "0.7rem" }}>
                  10:31 PM
                </Typography>
                <CheckCircleIcon sx={{ color: "#53bdeb", fontSize: 14 }} />
              </Box>
            </CardContent>
            <RenderButton buttons={buttons} template={template} />
          </Card>
        </Box>
      </Box>
    </div>
  );
};

export default TemplatePreview;

// --- Helpers ---

const RenderHeader = ({ header, template }) => {
  if (!header) return null;
  return <RenderHeaderFactory header={header} template={template} />;
};

const RenderHeaderFactory = ({ header, template }) => {
  // Process text to replace variables with sample values
  const processText = (text) => {
    if (!text) return '';
    
    // Replace variables like {{1}}, {{variable_name}} with sample values
    return text.replace(/{{([^}]+)}}/g, (match, variable) => {
      // Default sample values
      const sampleValues = {
        '1': 'John',
        '2': 'ABC123',
        '3': 'Tomorrow',
        'Name': 'Alex Smith',
        'Tracking Code': 'TRK-12345',
        'Inquiry Code': 'INQ-789',
        'Location': 'New York',
        'experience_name': 'Premium Package',
        'order_id': 'ORD-987654',
        'Agent': 'Sarah Johnson',
        'Today': new Date().toLocaleDateString(),
        'Future Date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        'Opt Out': 'Reply STOP to opt out',
      };
      
      // Check if we have custom example values from the Variables step
      if (template && template.variableInfo) {
        const variableInfo = template.variableInfo.find(v => v.name === variable);
        if (variableInfo && variableInfo.example) {
          return variableInfo.example;
        }
      }
      
      // Fall back to default sample values
      return sampleValues[variable] || `[${variable}]`;
    });
  };
  
  switch (header.format) {
    case "TEXT":
      return (
        <MessageTextBlock variant="header">{processText(header.text)}</MessageTextBlock>
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
          link={header.example?.link || header.image?.url}
          alt_text={header.example?.fileName || "Header Image"}
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

const RenderFooter = ({ footer, template }) => {
  if (!footer) return null;
  
  // Process text to replace variables with sample values
  const processText = (text) => {
    if (!text) return '';
    
    // Replace variables like {{1}}, {{variable_name}} with sample values
    return text.replace(/{{([^}]+)}}/g, (match, variable) => {
      // Default sample values
      const sampleValues = {
        '1': 'John',
        '2': 'ABC123',
        '3': 'Tomorrow',
        'Name': 'Alex Smith',
        'Tracking Code': 'TRK-12345',
        'Inquiry Code': 'INQ-789',
        'Location': 'New York',
        'experience_name': 'Premium Package',
        'order_id': 'ORD-987654',
        'Agent': 'Sarah Johnson',
        'Today': new Date().toLocaleDateString(),
        'Future Date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        'Opt Out': 'Reply STOP to opt out',
      };
      
      // Check if we have custom example values from the Variables step
      if (template && template.variableInfo) {
        const variableInfo = template.variableInfo.find(v => v.name === variable);
        if (variableInfo && variableInfo.example) {
          return variableInfo.example;
        }
      }
      
      // Fall back to default sample values
      return sampleValues[variable] || `[${variable}]`;
    });
  };
  
  return <MessageTextBlock variant="footer">{processText(footer.text)}</MessageTextBlock>;
};

const RenderBody = ({ body, template }) => {
  const [expanded, setExpanded] = useState(false);

  // Process text to replace variables with sample values
  const processText = (text) => {
    if (!text) return '';
    
    // Replace variables like {{1}}, {{variable_name}} with sample values
    return text.replace(/{{([^}]+)}}/g, (match, variable) => {
      // Default sample values
      const sampleValues = {
        '1': 'John',
        '2': 'ABC123',
        '3': 'Tomorrow',
        'Name': 'Alex Smith',
        'Tracking Code': 'TRK-12345',
        'Inquiry Code': 'INQ-789',
        'Location': 'New York',
        'experience_name': 'Premium Package',
        'order_id': 'ORD-987654',
        'Agent': 'Sarah Johnson',
        'Today': new Date().toLocaleDateString(),
        'Future Date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        'Opt Out': 'Reply STOP to opt out',
      };
      
      // Check if we have custom example values from the Variables step
      if (template && template.variableInfo) {
        const variableInfo = template.variableInfo.find(v => v.name === variable);
        if (variableInfo && variableInfo.example) {
          return variableInfo.example;
        }
      }
      
      // Fall back to default sample values
      return sampleValues[variable] || `[${variable}]`;
    });
  };
  
  // Helper function to extract variables from text
  const extractVariablesFromText = (text) => {
    if (!text) return [];
    const regex = /{{([^}]+)}}/g;
    const variables = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      variables.push(match[1]);
    }
    
    return variables;
  };

  const processedText = processText(body.text);
  const words = processedText.split(/\s+/);
  const shouldTruncate = words.length > 20;
  const displayText =
    expanded || !shouldTruncate
      ? processedText
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



const RenderButton = ({ buttons, template }) => {
  if (!buttons || buttons.length < 1) return null;
  
  // Process buttons to replace variables in text
  const processButtons = (buttons) => {
    if (!buttons || buttons.length === 0) return buttons;
    
    return buttons.map(button => {
      if (button.text) {
        // Process text to replace variables with sample values
        const processedText = button.text.replace(/{{([^}]+)}}/g, (match, variable) => {
          // Default sample values
          const sampleValues = {
            '1': 'John',
            '2': 'ABC123',
            '3': 'Tomorrow',
            'Name': 'Alex Smith',
            'Tracking Code': 'TRK-12345',
            'Inquiry Code': 'INQ-789',
            'Location': 'New York',
            'experience_name': 'Premium Package',
            'order_id': 'ORD-987654',
            'Agent': 'Sarah Johnson',
            'Today': new Date().toLocaleDateString(),
            'Future Date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            'Opt Out': 'Reply STOP to opt out',
          };
          
          // Check if we have custom example values from the Variables step
          if (template && template.variableInfo) {
            const variableInfo = template.variableInfo.find(v => v.name === variable);
            if (variableInfo && variableInfo.example) {
              return variableInfo.example;
            }
          }
          
          // Fall back to default sample values
          return sampleValues[variable] || `[${variable}]`;
        });
        
        return { ...button, text: processedText };
      }
      return button;
    });
  };
  
  const processedButtons = processButtons(buttons);
  return <ButtonComponent button={processedButtons} />;
};
