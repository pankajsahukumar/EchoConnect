import React, { useState } from "react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    Avatar,
} from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// NOTE: I need to make sure the imported components exist or copy them too.
// The user said "keep the files in the same folder template it should be seperate from rest".
// This implies I should probably copy the dependencies too or reference them if they are shared.
// The imports point to `../chat/components/...`. This is outside the `template` app.
// If I want to be truly separate, I should copy them. But for now, I'll reference them to avoid duplication unless they are specific to chat.
// However, the path `../chat/components` is relative. From `src/app/main/apps/template/TemplatePreview.js`, `../chat` would be `src/app/main/apps/chat`.
// So the import should be `../chat/components/...`.
// Wait, `src/app/main/apps/template` is a sibling of `src/app/main/apps/chat`.
// So `../chat` works.

const TemplatePreview = ({ template }) => {
    const header = template?.components?.find((c) => c.type === "HEADER");
    const body = template?.components?.find((c) => c.type === "BODY");
    const footer = template?.components?.find((c) => c.type === "FOOTER");
    const buttons =
        template?.components?.find((c) => c.type === "BUTTON")?.buttons || [];

    return (
        <div className="flex justify-center h-full overflow-hidden">
            <Box sx={{ width: "100%", maxWidth: 350, height: "fit-content", my: 'auto' }}>
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
                <Box sx={{ bgcolor: "#e5ddd5", p: 1.5, borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px", minHeight: 400, backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
                    {/* Timestamp */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                        <Typography variant="caption" sx={{ bgcolor: "rgba(225,245,254,.92)", px: 1, py: 0.5, borderRadius: 1, fontSize: '0.7rem' }}>
                            TODAY
                        </Typography>
                    </Box>

                    <Card
                        elevation={1}
                        sx={{
                            width: "100%",
                            margin: "0 auto",
                            borderRadius: "8px",
                            overflow: "hidden",
                            position: "relative",
                            bgcolor: 'white'
                        }}
                    >
                        <CardContent style={{ padding: "8px 8px 24px 8px" }}>
                            <RenderHeader header={header} template={template} />
                            <RenderBody body={body} template={template} />
                            <RenderFooter footer={footer} template={template} />

                            {/* Message time and status */}
                            <Box sx={{ position: 'absolute', bottom: 4, right: 6, display: "flex", alignItems: "center" }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontSize: "0.65rem" }}>
                                    12:00 PM
                                </Typography>
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
    const processText = (text) => {
        if (!text) return '';
        return text.replace(/{{([^}]+)}}/g, (match, variable) => `[${variable}]`);
    };

    switch (header.format) {
        case "TEXT":
            return (
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{processText(header.text)}</Typography>
            );
        case "VIDEO":
            return (
                <Box sx={{ height: 150, bgcolor: 'black', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Video</Box>
            );
        case "IMAGE":
            return (
                <Box sx={{ height: 150, bgcolor: '#eee', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {header.example?.link ? <img src={header.example.link} alt="Header" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : "Image"}
                </Box>
            );
        case "DOCUMENT":
            return (
                <Box sx={{ p: 2, bgcolor: '#f0f0f0', mb: 1, borderRadius: 1 }}>Document</Box>
            );
        default:
            return null;
    }
};

const RenderFooter = ({ footer, template }) => {
    if (!footer) return null;
    return <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.7rem' }}>{footer.text}</Typography>;
};

const RenderBody = ({ body, template }) => {
    if (!body) return null;

    const processText = (text) => {
        if (!text) return '';
        return text.replace(/{{([^}]+)}}/g, (match, variable) => `{{${variable}}}`);
    };

    return (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
            {processText(body.text)}
        </Typography>
    );
};

const RenderButton = ({ buttons, template }) => {
    if (!buttons || buttons.length < 1) return null;

    return (
        <Box sx={{ borderTop: '1px solid #eee' }}>
            {buttons.map((btn, idx) => (
                <Box key={idx} sx={{
                    p: 1.5,
                    textAlign: 'center',
                    color: '#00a5f4',
                    cursor: 'pointer',
                    borderBottom: idx < buttons.length - 1 ? '1px solid #eee' : 'none',
                    fontWeight: 500
                }}>
                    {btn.text}
                </Box>
            ))}
        </Box>
    );
};
