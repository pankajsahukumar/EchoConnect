import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import withReducer from 'app/store/withReducer';
import { createContext, useEffect, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import reducer from './store';
import BotFlow from './BotFlow';

const drawerWidth = 400;

export const BotFlowAppContext = createContext({});

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-content': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    height: '100%',
  },
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    maxWidth: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
}));
function BotFlowApp(props) {
 

  return (
    <BotFlowAppContext.Provider
    value={{}}>
     <Root
          header={
            <div className="p-24">
              <h4>BotFlow</h4>
            </div>
          }
          content={
           <BotFlow/>
          }
          scroll="content"
        />
    </BotFlowAppContext.Provider>
  );
}

export default withReducer('botFlowApp', reducer)(BotFlowApp);
