import { styled, useTheme, alpha } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ContactAvatar from '../../ContactAvatar';

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'isDummy',
})(({ theme, active, isDummy }) => ({
  borderRadius: 16,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  backgroundColor: active ? theme.palette.background.paper : 'transparent',
  boxShadow: active ? '0 8px 20px rgba(44,47,49,0.08)' : 'none',
  alignItems: 'flex-start',
  cursor: isDummy ? 'default' : 'pointer',
  opacity: isDummy ? 0.75 : 1,
  transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    backgroundColor: active ? theme.palette.background.paper : theme.palette.action.hover,
  },
}));

function getRelativeTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return format(date, 'PP');
}

function ContactListItem(props) {
  const { chat, contact } = props;
  const routeParams = useParams();
  const theme = useTheme();

  const isDummy = Boolean(contact.isDummy);
  const isActive = !isDummy && routeParams.id === contact.phoneNumber;
  const previewText = chat ? contact.lastMessage : contact.about;
  const tags = Array.isArray(contact.tags)
    ? contact.tags
    : contact.tags
      ? [contact.tags]
      : [];

  const tagStyles = {
    Priority: {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.main,
    },
    Urgent: {
      backgroundColor: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.error.main,
    },
    'SLA Breached': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
    Delay: {
      backgroundColor: alpha(theme.palette.warning.main || '#f59e0b', 0.12),
      color: theme.palette.warning.main || '#f59e0b',
    },
    Question: {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.secondary,
    },
  };

  const linkProps = isDummy
    ? {}
    : {
        to: `/apps/chat/${contact.phoneNumber}`,
      };

  return (
    <StyledListItem
      active={isActive ? 1 : 0}
      isDummy={isDummy ? 1 : 0}
      component={isDummy ? 'div' : NavLinkAdapter}
      button={!isDummy}
      className="min-h-80"
      {...linkProps}
    >
      <ContactAvatar contact={contact} />

      <Box sx={{ flex: 1, minWidth: 0, marginLeft: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }} noWrap>
            {contact.name}
          </Typography>
          {contact.lastMessageAt && (
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: theme.palette.error.main,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {getRelativeTime(contact.lastMessageAt)}
            </Typography>
          )}
        </Box>
        <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }} noWrap>
          {previewText || 'New conversation'}
        </Typography>

        {tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75, marginTop: 1, flexWrap: 'wrap' }}>
            {tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 999,
                  backgroundColor: tagStyles[tag]?.backgroundColor || theme.palette.action.hover,
                  color: tagStyles[tag]?.color || theme.palette.text.secondary,
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {Boolean(contact.unreadCount) && (
        <Box
          sx={{
            marginLeft: 1,
            marginTop: 0.5,
            minWidth: 20,
            height: 20,
            borderRadius: 999,
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {contact.unreadCount}
        </Box>
      )}
    </StyledListItem>
  );
}

export default ContactListItem;
