import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Paper,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
  getCustomerDetail,
  clearSelectedCustomer,
  selectSelectedCustomer,
  selectSelectedCustomerLoading,
} from './store/customersSlice';

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

function getAvatarColor(name) {
  if (!name) return '#9e9e9e';
  const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c62828', '#00838f', '#4e342e'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function SectionHeader({ icon, title }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      {icon}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function InfoRow({ label, value }) {
  const theme = useTheme();
  return (
    <Box
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
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{value || '-'}</Typography>
    </Box>
  );
}

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const customer = useSelector(selectSelectedCustomer);
  const loading = useSelector(selectSelectedCustomerLoading);

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerDetail(customerId));
    }
    return () => {
      dispatch(clearSelectedCustomer());
    };
  }, [dispatch, customerId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ p: 3 }}>
        <IconButton onClick={() => navigate('/apps/customers')} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" color="text.secondary">
          Customer not found.
        </Typography>
      </Box>
    );
  }

  const tags = Array.isArray(customer.tags)
    ? customer.tags
    : customer.tags
    ? [customer.tags]
    : [];

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/apps/customers')} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Back to Customers
        </Typography>
      </Box>

      {/* Header: Avatar + Name + Contact */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Avatar
          src={customer.avatar}
          sx={{
            width: 80,
            height: 80,
            fontSize: 28,
            fontWeight: 600,
            bgcolor: getAvatarColor(customer.name),
          }}
        >
          {customer.name ? customer.name[0].toUpperCase() : '?'}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {customer.name || 'Unknown'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
            {customer.phoneNumber && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {customer.phoneNumber}
                </Typography>
              </Box>
            )}
            {customer.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {customer.email}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tags */}
      {tags.length > 0 && (
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
        >
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
                    height: 26,
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
        </Paper>
      )}

      {/* Contact Information */}
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
      >
        <SectionHeader
          icon={<InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
          title="Contact Information"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <InfoRow label="Phone" value={customer.phoneNumber} />
          <InfoRow label="Email" value={customer.email} />
          {customer.address && <InfoRow label="Address" value={customer.address} />}
          <InfoRow label="Created" value={formatDate(customer.createdAt)} />
        </Box>
      </Paper>

      {/* Last Activity */}
      {customer.lastMessage && (
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
        >
          <SectionHeader
            icon={<ChatBubbleOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
            title="Last Activity"
          />
          <Box
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.action.selected, 0.4),
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {customer.lastMessage}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(customer.lastMessageAt)}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
