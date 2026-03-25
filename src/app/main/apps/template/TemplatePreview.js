import {
    Card,
    CardContent,
    Box,
    Typography,
    Avatar,
} from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import DescriptionIcon from '@mui/icons-material/Description';

/**
 * Replace {{varName}} with sample values from template.variableSamples
 * Falls back to showing {{varName}} if no sample provided
 */
function replaceVariables(text, scope, variableSamples) {
    if (!text) return '';
    const samples = variableSamples || {};
    return text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
        const trimmed = varName.trim();
        const sampleValue = samples[`${scope}:${trimmed}`];
        return sampleValue || `{{${trimmed}}}`;
    });
}

const TemplatePreview = ({ template }) => {
    const header = template?.components?.find((c) => c.type === "HEADER");
    const body = template?.components?.find((c) => c.type === "BODY");
    const footer = template?.components?.find((c) => c.type === "FOOTER");
    const buttonsComp = template?.components?.find((c) => c.type === "BUTTONS");
    const buttons = buttonsComp?.buttons || [];
    const samples = template?.variableSamples || {};

    return (
        <Box
            sx={{
                width: 320,
                minWidth: 320,
                maxWidth: 320,
                mx: 'auto',
                borderRadius: '32px',
                border: '8px solid #1a1a1a',
                overflow: 'hidden',
                bgcolor: '#1a1a1a',
                boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
            }}
        >
            {/* Phone Status Bar */}
            <Box
                sx={{
                    bgcolor: '#075E54',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.65rem',
                    color: 'white',
                }}
            >
                <Typography sx={{ fontSize: '0.65rem', color: 'white' }}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.6rem', color: 'white' }}>4G</Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: 'white' }}>99%</Typography>
                </Box>
            </Box>

            {/* WhatsApp Header */}
            <Box
                sx={{
                    bgcolor: '#075E54',
                    color: 'white',
                    px: 1.5,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ fontSize: '1rem', mr: 1 }}>←</Typography>
                <Avatar sx={{ bgcolor: 'white', width: 28, height: 28, mr: 1 }}>
                    <WhatsAppIcon sx={{ color: '#25D366', fontSize: 18 }} />
                </Avatar>
                <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 600 }}>
                    Cheris...
                </Typography>
                <Typography sx={{ fontSize: '1rem', ml: 1 }}>📞</Typography>
            </Box>

            {/* Message Container */}
            <Box
                sx={{
                    bgcolor: '#e5ddd5',
                    p: 1.5,
                    minHeight: 420,
                    maxHeight: 480,
                    overflow: 'auto',
                    backgroundImage:
                        'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                    backgroundSize: 'cover',
                    '&::-webkit-scrollbar': { width: 3 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: 2 },
                }}
            >
                {/* Timestamp */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            bgcolor: 'rgba(225,245,254,.92)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.65rem',
                        }}
                    >
                        TODAY
                    </Typography>
                </Box>

                <Card
                    elevation={1}
                    sx={{
                        width: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        bgcolor: 'white',
                    }}
                >
                    <CardContent sx={{ p: '8px', pb: '24px !important' }}>
                        <RenderHeader header={header} samples={samples} />
                        <RenderBody body={body} samples={samples} />
                        <RenderFooter footer={footer} />

                        {/* Message time */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 4,
                                right: 6,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: '0.6rem' }}
                            >
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    </CardContent>
                    <RenderButtons buttons={buttons} />
                </Card>
            </Box>

            {/* Bottom Input Bar */}
            <Box
                sx={{
                    bgcolor: '#f0f0f0',
                    px: 1,
                    py: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                }}
            >
                <Typography sx={{ fontSize: '1rem' }}>😊</Typography>
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: 'white',
                        borderRadius: '18px',
                        px: 1.5,
                        py: 0.5,
                    }}
                >
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                        Message
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem' }}>📎</Typography>
                <Typography sx={{ fontSize: '0.85rem' }}>📷</Typography>
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#25D366',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography sx={{ fontSize: '0.8rem', color: 'white' }}>🎤</Typography>
                </Box>
            </Box>

            {/* Phone Bottom Bar */}
            <Box sx={{ bgcolor: '#1a1a1a', display: 'flex', justifyContent: 'center', py: 0.5 }}>
                <Box sx={{ width: 100, height: 4, bgcolor: '#666', borderRadius: 2 }} />
            </Box>
        </Box>
    );
};

export default TemplatePreview;

// --- Helpers ---

const RenderHeader = ({ header, samples }) => {
    if (!header || header.format === 'NONE') return null;

    switch (header.format) {
        case "TEXT":
            return (
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {replaceVariables(header.text, 'header', samples)}
                </Typography>
            );
        case "IMAGE":
            return (
                <Box sx={{
                    height: 150,
                    bgcolor: '#f5f5f5',
                    mb: 1,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}>
                    {header.mediaUrl ? (
                        <img
                            src={header.mediaUrl}
                            alt="Header"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <ImageIcon sx={{ fontSize: 48, color: '#bdbdbd' }} />
                    )}
                </Box>
            );
        case "VIDEO":
            return (
                <Box sx={{
                    height: 150,
                    bgcolor: '#212121',
                    mb: 1,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <VideocamIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
            );
        case "DOCUMENT":
            return (
                <Box sx={{
                    p: 2,
                    bgcolor: '#f5f5f5',
                    mb: 1,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}>
                    <DescriptionIcon sx={{ color: '#757575' }} />
                    <Typography variant="body2" color="text.secondary">Document</Typography>
                </Box>
            );
        default:
            return null;
    }
};

const RenderBody = ({ body, samples }) => {
    if (!body || !body.text) return null;

    return (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
            {replaceVariables(body.text, 'body', samples)}
        </Typography>
    );
};

const RenderFooter = ({ footer }) => {
    if (!footer || !footer.text) return null;
    return (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.7rem' }}>
            {footer.text}
        </Typography>
    );
};

const RenderButtons = ({ buttons }) => {
    if (!buttons || buttons.length === 0) return null;

    return (
        <Box sx={{ borderTop: '1px solid #eee' }}>
            {buttons.map((btn, idx) => (
                <Box key={idx} sx={{
                    p: 1.5,
                    textAlign: 'center',
                    color: '#00a5f4',
                    cursor: 'pointer',
                    borderBottom: idx < buttons.length - 1 ? '1px solid #eee' : 'none',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                }}>
                    {btn.text || 'Button'}
                </Box>
            ))}
        </Box>
    );
};
