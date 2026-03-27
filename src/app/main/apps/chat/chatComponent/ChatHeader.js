import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { selectContactByMobile } from '../store/contactsSlice';
import { ChatAppContext } from '../ChatApp';
import ContactAvatar from '../ContactAvatar';

const TAG_STYLES = {
    Priority: { bg: '#e8f4fd', color: '#1565c0' },
    Urgent: { bg: '#fdecea', color: '#c62828' },
    'SLA Breached': { bg: '#c62828', color: '#fff' },
    Delay: { bg: '#fff8e1', color: '#e65100' },
    Question: { bg: '#f3f3f3', color: '#555' },
};

function getTagStyle(theme, tag) {
    if (TAG_STYLES[tag]) return TAG_STYLES[tag];
    return { bg: alpha(theme.palette.secondary.main, 0.12), color: theme.palette.secondary.main };
}

export default function ChatHeader() {
    const { setContactSidebarOpen, contactSidebarOpen } = useContext(ChatAppContext);
    const theme = useTheme();
    const routeParams = useParams();
    const contact = useSelector((state) => selectContactByMobile(state, routeParams.id));

    if (!contact) return null;

    const tags = Array.isArray(contact.tags)
        ? contact.tags
        : contact.tags
        ? [contact.tags]
        : [];

    // Bot status — placeholder until real bot data is wired
    const botActive = Boolean(contact.botRunActive);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.25,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                flexShrink: 0,
                minHeight: 60,
            }}
        >
            {/* Avatar */}
            <ContactAvatar contact={contact} sx={{ width: 36, height: 36, fontSize: 14 }} />

            {/* Name + Tags */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }} noWrap>
                    {contact.name}
                </Typography>
                {tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25, flexWrap: 'wrap' }}>
                        {tags.slice(0, 3).map((tag) => {
                            const style = getTagStyle(theme, tag);
                            return (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        borderRadius: 999,
                                        backgroundColor: style.bg,
                                        color: style.color,
                                        '& .MuiChip-label': { px: 1 },
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}
            </Box>

            {/* Bot indicator */}
            <Chip
                icon={
                    <SmartToyOutlinedIcon
                        sx={{ fontSize: '14px !important', color: botActive ? '#22c55e' : '#9ca3af' }}
                    />
                }
                label={botActive ? 'Bot: On' : 'Bot: Off'}
                size="small"
                sx={{
                    height: 24,
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    bgcolor: botActive ? alpha('#22c55e', 0.12) : alpha('#9ca3af', 0.12),
                    color: botActive ? '#16a34a' : '#6b7280',
                    '& .MuiChip-label': { px: 1 },
                }}
            />

            {/* Close conversation */}
            <Tooltip title="Close conversation">
                <IconButton
                    size="small"
                    sx={{
                        bgcolor: alpha('#22c55e', 0.1),
                        color: '#16a34a',
                        '&:hover': { bgcolor: alpha('#22c55e', 0.2) },
                        width: 32,
                        height: 32,
                    }}
                >
                    <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>

            {/* Three-dot — opens contact info panel */}
            <Tooltip title="Contact info">
                <IconButton
                    size="small"
                    onClick={() => setContactSidebarOpen((prev) => !prev)}
                    sx={{
                        bgcolor: contactSidebarOpen ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        color: contactSidebarOpen ? theme.palette.primary.main : 'text.secondary',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                        width: 32,
                        height: 32,
                    }}
                >
                    <MoreVertIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
