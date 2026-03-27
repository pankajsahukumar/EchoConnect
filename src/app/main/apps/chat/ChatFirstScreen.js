import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { alpha, useTheme } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useContext } from 'react';
import { ChatAppContext } from './ChatApp';

function getToken(theme, key, fallback) {
  return theme.palette[key] || theme.palette.custom?.[key] || fallback;
}

const ChatFirstScreen = () => {
  const { setMainSidebarOpen } = useContext(ChatAppContext);
  const theme = useTheme();

  const surfaceContainerLow = getToken(
    theme,
    'surfaceContainerLow',
    alpha(theme.palette.background.default, 0.6)
  );
  const surfaceContainerLowest = getToken(
    theme,
    'surfaceContainerLowest',
    theme.palette.background.paper
  );
  const surfaceContainerHigh = getToken(
    theme,
    'surfaceContainerHigh',
    theme.palette.action.hover
  );
  const onSurface = getToken(theme, 'onSurface', theme.palette.text.primary);
  const onSurfaceVariant = getToken(theme, 'onSurfaceVariant', theme.palette.text.secondary);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 3, md: 6 },
        backgroundColor: surfaceContainerLow,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 960, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Box
            sx={{
              position: 'absolute',
              top: -48,
              left: -48,
              width: 160,
              height: 160,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              filter: 'blur(32px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -48,
              right: -48,
              width: 220,
              height: 220,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.secondary.main, 0.12),
              filter: 'blur(32px)',
            }}
          />
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              width: { xs: '100%', sm: 320 },
              padding: 4,
              borderRadius: 6,
              backgroundColor: alpha(surfaceContainerLowest, 0.7),
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 48px rgba(44,47,49,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${
                  theme.palette.secondary.main
                })`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: theme.palette.primary.contrastText,
                boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <FuseSvgIcon size={40}>heroicons-solid:chat-bubble-left-right</FuseSvgIcon>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              <Box
                sx={{
                  height: 8,
                  width: '70%',
                  marginX: 'auto',
                  borderRadius: 999,
                  backgroundColor: surfaceContainerHigh,
                }}
              />
              <Box
                sx={{
                  height: 8,
                  width: '50%',
                  marginX: 'auto',
                  borderRadius: 999,
                  backgroundColor: surfaceContainerHigh,
                }}
              />
              <Box
                sx={{
                  height: 8,
                  width: '60%',
                  marginX: 'auto',
                  borderRadius: 999,
                  backgroundColor: surfaceContainerHigh,
                }}
              />
            </Box>

            <Button
              fullWidth
              onClick={() => setMainSidebarOpen(true)}
              sx={{
                borderRadius: 3,
                paddingY: 1.2,
                fontWeight: 700,
                fontSize: 13,
                color: theme.palette.primary.contrastText,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${
                  theme.palette.secondary.dark
                })`,
                boxShadow: `0 12px 24px ${alpha(theme.palette.secondary.main, 0.2)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${
                    theme.palette.secondary.dark
                  })`,
                  opacity: 0.95,
                },
              }}
            >
              Select a chat
            </Button>
          </Paper>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: 24, md: 32 },
            fontWeight: 800,
            color: onSurface,
            marginBottom: 1.5,
          }}
        >
          Welcome back, Curator
        </Typography>
        <Typography sx={{ color: onSurfaceVariant, maxWidth: 520, margin: '0 auto' }}>
          Select a conversation from the sidebar to start engaging with your workspace members.
          Every message is a step toward clarity.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            gap: 2,
            marginTop: 6,
          }}
        >
          {[
            {
              icon: 'heroicons-solid:bolt',
              label: 'Fast Response',
              text: 'Average response time is currently under 4 minutes.',
              color: theme.palette.primary.main,
            },
            {
              icon: 'heroicons-solid:user-plus',
              label: 'New Requests',
              text: 'You have 12 unassigned support tickets waiting.',
              color: theme.palette.secondary.main,
            },
            {
              icon: 'heroicons-solid:sparkles',
              label: 'AI Insights',
              text: 'Three high-priority topics detected in recent chats.',
              color: theme.palette.tertiary?.main || theme.palette.primary.main,
            },
          ].map((item) => (
            <Paper
              key={item.label}
              elevation={0}
              sx={{
                padding: 3,
                borderRadius: 4,
                backgroundColor: surfaceContainerLowest,
                boxShadow: '0 12px 24px rgba(44,47,49,0.06)',
                textAlign: 'left',
              }}
            >
              <FuseSvgIcon sx={{ color: item.color, marginBottom: 1 }}>
                {item.icon}
              </FuseSvgIcon>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: onSurface,
                  marginBottom: 0.5,
                }}
              >
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: 11, color: onSurfaceVariant }}>{item.text}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatFirstScreen;
