import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import { useTheme, alpha } from '@mui/material/styles';
import { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ContactListItem from './ContactListItem';
import ContactAvatar from '../../ContactAvatar';
import MainSidebarMoreMenu from './MainSidebarMoreMenu';
import { selectContacts } from '../../store/contactsSlice';
import { ChatAppContext } from '../../ChatApp';
import { selectUser } from '../../store/userSlice';

const DUMMY_CONTACTS = [
  {
    id: 'dummy-1',
    phoneNumber: 'dummy-1',
    name: 'Sarah Miller',
    lastMessage: 'Could you check the status of my subscription renewal?',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 1,
    status: 'online',
    tags: ['Priority', 'Urgent'],
    isDummy: true,
  },
  {
    id: 'dummy-2',
    phoneNumber: 'dummy-2',
    name: 'David Chen',
    lastMessage: 'The integration looks good on my end. Thanks for the update.',
    lastMessageAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    unreadCount: 0,
    status: 'away',
    tags: ['SLA Breached'],
    isDummy: true,
  },
  {
    id: 'dummy-3',
    phoneNumber: 'dummy-3',
    name: 'Marcus Wright',
    lastMessage: 'Is there a way to export the analytics to a CSV format?',
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    status: 'offline',
    tags: ['Delay', 'Question'],
    isDummy: true,
  },
];

const PROFILE_PLACEMENT = 'top'; // 'top' | 'bottom'

function getToken(theme, key, fallback) {
  return theme.palette[key] || theme.palette.custom?.[key] || fallback;
}

function MainSidebar() {
  const { setUserSidebarOpen } = useContext(ChatAppContext);
  const theme = useTheme();

  const contacts = useSelector(selectContacts);
  const user = useSelector(selectUser);

  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('my');
  const [activeChip, setActiveChip] = useState('all');

  const surface = getToken(theme, 'surface', theme.palette.background.default);
  const surfaceContainerLow = getToken(
    theme,
    'surfaceContainerLow',
    alpha(theme.palette.background.paper, 0.7)
  );
  const surfaceContainerLowest = getToken(theme, 'surfaceContainerLowest', theme.palette.background.paper);
  const surfaceContainerHigh = getToken(theme, 'surfaceContainerHigh', theme.palette.action.hover);
  const onSurface = getToken(theme, 'onSurface', theme.palette.text.primary);
  const onSurfaceVariant = getToken(theme, 'onSurfaceVariant', theme.palette.text.secondary);
  const secondaryContainer = getToken(theme, 'secondaryContainer', alpha(theme.palette.secondary.main, 0.2));
  const onSecondaryContainer = getToken(
    theme,
    'onSecondaryContainer',
    theme.palette.secondary.main
  );

  const baseContacts = contacts && contacts.length > 0 ? contacts : DUMMY_CONTACTS;
  const demoTags = [
    ['Priority', 'Urgent'],
    ['SLA Breached'],
    ['Delay', 'Question'],
  ];

  const displayContacts = useMemo(() => {
    if (baseContacts === DUMMY_CONTACTS) {
      return baseContacts;
    }
    return baseContacts.map((contact, index) => {
      if (contact.tags && contact.tags.length > 0) {
        return contact;
      }
      if (index < demoTags.length) {
        return { ...contact, tags: demoTags[index], demoTag: true };
      }
      return contact;
    });
  }, [baseContacts]);

  const filteredContacts = useMemo(() => {
    if (!searchText) {
      return displayContacts;
    }
    return FuseUtils.filterArrayByString(displayContacts, searchText);
  }, [displayContacts, searchText]);

  return (
    <div className="flex flex-col flex-auto h-full">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          flex: 1,
          minHeight: 0,
          backgroundColor: surface,
          padding: 3,
          gap: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: onSurface }}>
            Conversations
          </Typography>
          <MainSidebarMoreMenu />
        </Box>

        {PROFILE_PLACEMENT === 'top' && user && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              paddingX: 1.4,
              paddingY: 1,
              borderRadius: 2,
              backgroundColor: surfaceContainerLow,
              cursor: 'pointer',
              width: 'fit-content',
            }}
            onClick={() => setUserSidebarOpen(true)}
            onKeyDown={() => setUserSidebarOpen(true)}
            role="button"
            tabIndex={0}
          >
            <ContactAvatar className="relative" contact={user} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, color: onSurface, fontSize: 12 }} noWrap>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: 10, color: onSurfaceVariant }}>Agent</Typography>
            </Box>
          </Box>
        )}

        {/* Tabs */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 1,
            padding: 1,
            backgroundColor: surfaceContainerLow,
            borderRadius: 3,
          }}
        >
          {[
            { id: 'my', label: 'My Chats' },
            { id: 'unassigned', label: 'Unassigned' },
            { id: 'sla', label: 'SLA' },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                height: 36,
                borderRadius: 2,
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 700 : 600,
                backgroundColor: activeTab === tab.id ? surfaceContainerLowest : 'transparent',
                color: activeTab === tab.id ? theme.palette.secondary.main : onSurfaceVariant,
                boxShadow:
                  activeTab === tab.id
                    ? '0 8px 20px rgba(44,47,49,0.08)'
                    : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* Chips */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            paddingBottom: 0.5,
          }}
        >
          {[
            { id: 'all', label: 'All' },
            { id: 'open', label: 'Open' },
            { id: 'closed', label: 'Closed' },
            { id: 'await', label: 'Await Reply' },
          ].map((chip) => (
            <Chip
              key={chip.id}
              label={chip.label}
              onClick={() => setActiveChip(chip.id)}
              sx={{
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 12,
                height: 30,
                backgroundColor:
                  activeChip === chip.id ? secondaryContainer : surfaceContainerHigh,
                color: activeChip === chip.id ? onSecondaryContainer : onSurfaceVariant,
              }}
            />
          ))}
        </Box>

        {/* Search */}
        <Paper
          sx={{
            paddingY: 0.5,
            paddingX: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: 3,
            backgroundColor: surfaceContainerLow,
            boxShadow: 'none',
          }}
        >
          <FuseSvgIcon color="action" size={20}>
            heroicons-solid:search
          </FuseSvgIcon>
          <Input
            placeholder="Search chats..."
            disableUnderline
            fullWidth
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            inputProps={{ 'aria-label': 'Search' }}
          />
        </Paper>

        {/* Chat list */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
            '& .ps__rail-y, & .ps__rail-x': {
              display: 'none',
            },
          }}
        >
          <FuseScrollbars className="overflow-y-auto flex-1">
            <List className="w-full" disablePadding>
              {filteredContacts.map((contact) => (
                <ContactListItem key={contact.id || contact.phoneNumber} chat contact={contact} />
              ))}
            </List>
          </FuseScrollbars>
          <Fab
            color="primary"
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
            }}
          >
            <FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
          </Fab>
        </Box>

        {PROFILE_PLACEMENT === 'bottom' && user && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              paddingX: 1.4,
              paddingY: 1,
              borderRadius: 2,
              backgroundColor: surfaceContainerLow,
              cursor: 'pointer',
            }}
            onClick={() => setUserSidebarOpen(true)}
            onKeyDown={() => setUserSidebarOpen(true)}
            role="button"
            tabIndex={0}
          >
            <ContactAvatar className="relative" contact={user} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, color: onSurface, fontSize: 12 }} noWrap>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: 10, color: onSurfaceVariant }}>Agent</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default MainSidebar;
