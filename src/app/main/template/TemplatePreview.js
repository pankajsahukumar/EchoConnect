import {
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import MicIcon from "@mui/icons-material/Mic";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const TemplatePreview = ({ template }) => {
    const header = template?.components?.find((c) => c.type === "HEADER");
    const body = template?.components?.find((c) => c.type === "BODY");
    const footer = template?.components?.find((c) => c.type === "FOOTER");
    const buttons =
        template?.components?.find((c) => c.type === "BUTTONS")?.buttons || [];

    return (
        <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
            {/* Phone Frame */}
            <Box
                sx={{
                    width: 280,
                    height: 560,
                    borderRadius: "28px",
                    border: "8px solid #1a1a1a",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#e5ddd5",
                    position: "relative",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                }}
            >
                {/* Status Bar */}
                <Box
                    sx={{
                        bgcolor: "#075E54",
                        px: 1.5,
                        py: 0.3,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="caption" sx={{ color: "white", fontSize: "0.6rem" }}>
                        8:15 pm
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "white", fontSize: "0.6rem" }}>
                            4G
                        </Typography>
                        <Typography variant="caption" sx={{ color: "white", fontSize: "0.6rem" }}>
                            99%
                        </Typography>
                    </Box>
                </Box>

                {/* WhatsApp Header */}
                <Box
                    sx={{
                        bgcolor: "#075E54",
                        px: 1,
                        py: 0.8,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <ArrowBackIcon sx={{ color: "white", fontSize: 18, mr: 0.5 }} />
                    <Avatar
                        sx={{ width: 28, height: 28, mr: 1, bgcolor: "#ccc", fontSize: 14 }}
                    >
                        C
                    </Avatar>
                    <Typography
                        variant="subtitle2"
                        sx={{ color: "white", flex: 1, fontSize: "0.8rem", fontWeight: 600 }}
                        noWrap
                    >
                        Cheris...
                    </Typography>
                    <CallIcon sx={{ color: "white", fontSize: 16, mr: 1.5 }} />
                    <MoreVertIcon sx={{ color: "white", fontSize: 16 }} />
                </Box>

                {/* Chat Area */}
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: "#e5ddd5",
                        backgroundImage:
                            'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                        backgroundSize: "cover",
                        p: 1,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Time stamp */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                bgcolor: "rgba(225,245,254,.92)",
                                px: 1,
                                py: 0.3,
                                borderRadius: 1,
                                fontSize: "0.6rem",
                            }}
                        >
                            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </Typography>
                    </Box>

                    {/* Message Bubble - only show if there's content */}
                    {(header?.format && header.format !== "NONE") ||
                    body?.text ||
                    footer?.text ||
                    buttons.length > 0 ? (
                        <Card
                            elevation={1}
                            sx={{
                                maxWidth: "85%",
                                borderRadius: "8px",
                                overflow: "hidden",
                                bgcolor: "white",
                                alignSelf: "flex-start",
                            }}
                        >
                            <CardContent sx={{ p: "6px 8px !important", pb: "16px !important", position: "relative" }}>
                                <RenderHeader header={header} />
                                <RenderBody body={body} />
                                <RenderFooter footer={footer} />

                                {/* Time */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: "absolute",
                                        bottom: 2,
                                        right: 6,
                                        fontSize: "0.55rem",
                                        color: "text.secondary",
                                    }}
                                >
                                    {new Date().toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Typography>
                            </CardContent>

                            <RenderButtons buttons={buttons} />
                        </Card>
                    ) : null}
                </Box>

                {/* Bottom Input Bar */}
                <Box
                    sx={{
                        bgcolor: "#f0f0f0",
                        px: 0.5,
                        py: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <EmojiEmotionsOutlinedIcon sx={{ fontSize: 18, color: "#54656f" }} />
                    <Box
                        sx={{
                            flex: 1,
                            bgcolor: "white",
                            borderRadius: "16px",
                            px: 1,
                            py: 0.3,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                            Message
                        </Typography>
                    </Box>
                    <AttachFileIcon
                        sx={{ fontSize: 16, color: "#54656f", transform: "rotate(45deg)" }}
                    />
                    <CameraAltOutlinedIcon sx={{ fontSize: 16, color: "#54656f" }} />
                    <Box
                        sx={{
                            bgcolor: "#00a884",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MicIcon sx={{ fontSize: 16, color: "white" }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TemplatePreview;

// --- Sub-components ---

const RenderHeader = ({ header }) => {
    if (!header || !header.format || header.format === "NONE") return null;

    const processText = (text) => {
        if (!text) return "";
        return text.replace(/\{\{([^}]+)\}\}/g, (match, variable) => `{{${variable}}}`);
    };

    switch (header.format) {
        case "TEXT":
            return (
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.8rem" }}>
                    {processText(header.text) || "Header text"}
                </Typography>
            );
        case "IMAGE": {
            const imgUrl = header.image?.url || header.example?.link;
            return (
                <Box
                    sx={{
                        height: 100,
                        bgcolor: "#e0e0e0",
                        mb: 0.5,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {imgUrl ? (
                        <img
                            src={imgUrl}
                            alt="Header"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                        />
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            Image
                        </Typography>
                    )}
                </Box>
            );
        }
        case "VIDEO": {
            const videoUrl = header.video?.url;
            return (
                <Box
                    sx={{
                        height: 100,
                        bgcolor: "#1a1a1a",
                        mb: 0.5,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {videoUrl ? (
                        <video
                            src={videoUrl}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            muted
                        />
                    ) : (
                        <Typography variant="caption" sx={{ color: "white" }}>
                            Video
                        </Typography>
                    )}
                </Box>
            );
        }
        case "DOCUMENT":
            return (
                <Box
                    sx={{
                        p: 1,
                        bgcolor: "#f5f5f5",
                        mb: 0.5,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <InsertDriveFileIcon sx={{ color: "#e53935", fontSize: 20 }} />
                    <Typography variant="caption">Document.pdf</Typography>
                </Box>
            );
        default:
            return null;
    }
};

const RenderBody = ({ body }) => {
    if (!body || !body.text) return null;

    const renderText = (text) => {
        // Highlight variables in the body
        const parts = text.split(/(\{\{[^}]+\}\})/g);
        return parts.map((part, i) => {
            if (part.match(/^\{\{[^}]+\}\}$/)) {
                return (
                    <Typography
                        key={i}
                        component="span"
                        sx={{ color: "#00a884", fontWeight: 500, fontSize: "0.75rem" }}
                    >
                        {part}
                    </Typography>
                );
            }
            return part;
        });
    };

    return (
        <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", fontSize: "0.75rem", lineHeight: 1.4 }}
        >
            {renderText(body.text)}
        </Typography>
    );
};

const RenderFooter = ({ footer }) => {
    if (!footer || !footer.text) return null;
    return (
        <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5, fontSize: "0.6rem" }}
        >
            {footer.text}
        </Typography>
    );
};

const RenderButtons = ({ buttons }) => {
    if (!buttons || buttons.length === 0) return null;

    return (
        <Box sx={{ borderTop: "1px solid #eee" }}>
            {buttons.map((btn, idx) => (
                <Box
                    key={idx}
                    sx={{
                        py: 0.8,
                        textAlign: "center",
                        color: "#00a5f4",
                        cursor: "pointer",
                        borderBottom: idx < buttons.length - 1 ? "1px solid #eee" : "none",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                    }}
                >
                    {btn.type === "URL" && <OpenInNewIcon sx={{ fontSize: 12 }} />}
                    {btn.type === "PHONE_NUMBER" && <CallIcon sx={{ fontSize: 12 }} />}
                    {btn.text || "Button"}
                </Box>
            ))}
        </Box>
    );
};

