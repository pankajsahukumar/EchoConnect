import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
    Tooltip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { selectContactByMobile } from '../../store/contactsSlice';
import ContactAvatar from '../../ContactAvatar';
import { ChatAppContext } from '../../ChatApp';

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

// Placeholder custom fields — replace with real data when API is ready
const DEMO_CUSTOM_FIELDS = [
    { label: 'Order ID', value: '#ORD-20481' },
    { label: 'City', value: 'Mumbai' },
    { label: 'Plan', value: 'Premium' },
    { label: 'Assigned Agent', value: 'Riya Sharma' },
];

function SectionHeader({ icon, title }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            {icon}
            <Typography sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'text.secondary' }}>
                {title}
            </Typography>
        </Box>
    );
}

export default function ContactSidebar() {
    const { setContactSidebarOpen } = useContext(ChatAppContext);
    const theme = useTheme();
    const routeParams = useParams();
    const contactId = routeParams.id;
    const contact = useSelector((state) => selectContactByMobile(state, contactId));

    if (!contact) return null;

    const tags = Array.isArray(contact.tags)
        ? contact.tags
        : contact.tags
        ? [contact.tags]
        : [];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.paper',
            }}
        >
            {/* Header bar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0,
                }}
            >
                <Typography sx={{ flex: 1, fontWeight: 700, fontSize: 15 }}>
                    Contact info
                </Typography>
                <Tooltip title="Close">
                    <IconButton size="small" onClick={() => setContactSidebarOpen(false)}>
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Scrollable body */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Avatar + Name */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <ContactAvatar
                        contact={contact}
                        sx={{ width: 80, height: 80, fontSize: 28 }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: 18, textAlign: 'center' }}>
                        {contact.name}
                    </Typography>
                </Box>

                <Divider />

                {/* Phone number */}
                <Box>
                    <SectionHeader
                        icon={<PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
                        title="Phone"
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: alpha(theme.palette.action.selected, 0.5),
                            borderRadius: 2,
                            px: 2,
                            py: 1.25,
                        }}
                    >
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                            {contact.phoneNumber || '—'}
                        </Typography>
                    </Box>
                </Box>

                {/* Tags */}
                {tags.length > 0 && (
                    <Box>
                        <SectionHeader
                            icon={<LocalOfferOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
                            title="Tags"
                        />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {tags.map((tag) => {
                                const style = getTagStyle(theme, tag);
                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        sx={{
                                            height: 24,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            borderRadius: 999,
                                            backgroundColor: style.bg,
                                            color: style.color,
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {/* Custom Fields */}
                <Box>
                    <SectionHeader
                        icon={<TuneOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
                        title="Custom Fields"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {DEMO_CUSTOM_FIELDS.map((field) => (
                            <Box
                                key={field.label}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 1,
                                    px: 1.5,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.action.selected, 0.4),
                                }}
                            >
                                <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}>
                                    {field.label}
                                </Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                                    {field.value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
