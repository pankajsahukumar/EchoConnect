import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import Logo from '../../../../shared-components/Logo';
import NavbarToggleButton from '../../../../shared-components/NavbarToggleButton';
import Navigation from '../../../../shared-components/Navigation';
import { selectUser } from 'app/store/userSlice';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '& ::-webkit-scrollbar-thumb': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
    }`,
  },
  '& ::-webkit-scrollbar-thumb:active': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
    }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: 'contain',
  overflowX: 'hidden',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  background:
    'linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 40px, 100% 10px',
  backgroundAttachment: 'local, scroll',
}));

function NavbarStyle2Content(props) {
  const user = useSelector(selectUser);
  const displayName = user?.data?.displayName || 'Agent';
  const avatarSrc = user?.data?.photoURL;
  return (
    <Root className={clsx('flex flex-auto flex-col overflow-hidden h-full', props.className)}>
      <AppBar
        color="primary"
        position="static"
        className="flex flex-row items-center shrink h-48 md:h-76 min-h-48 md:min-h-76 px-12 shadow-0"
      >
        <div className="flex flex-1 mx-4">
          <Logo />
        </div>

        <NavbarToggleButton className="w-40 h-40 p-0" />
      </AppBar>

      <StyledContent option={{ suppressScrollX: true, wheelPropagation: false }}>
        <Navigation layout="vertical" />
      </StyledContent>

      <Box
        className="flex items-center gap-12 px-16 py-12"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Avatar
          src={avatarSrc}
          alt={displayName}
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'background.paper',
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {displayName.charAt(0)}
        </Avatar>
        <Typography className="font-semibold text-14" noWrap>
          {displayName}
        </Typography>
      </Box>
    </Root>
  );
}

export default memo(NavbarStyle2Content);
