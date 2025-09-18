import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import { createContext } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import reducer from './store';
import BotFlow from './BotFlow';

export const BotFlowAppContext = createContext({});

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-content': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    height: '100%',
  },
}));

const HeaderContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
}));

function BotFlowApp(props) {
  return (
    <BotFlowAppContext.Provider value={{}}>
      <Root
        content={<BotFlow />}
        scroll="content"
      />
    </BotFlowAppContext.Provider>
  );
}

export default withReducer('botFlowApp', reducer)(BotFlowApp);
