import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import SettingsSidebar from './SettingsSidebar';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flex: '1 1 auto',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
}));

function SettingsApp() {
  return (
    <Root>
      <SettingsSidebar />
      <Outlet />
    </Root>
  );
}

export default withReducer('settingsApp', reducer)(SettingsApp);
