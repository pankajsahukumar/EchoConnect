import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CodeIcon from '@mui/icons-material/Code';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TableChartIcon from '@mui/icons-material/TableChart';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import ChatIcon from '@mui/icons-material/Chat';
import CircularProgress from '@mui/material/CircularProgress';

const StyledSidebar = styled(Paper)(({ theme }) => ({
  width: 280,
  height: '100%',
  overflow: 'auto',
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const DraggableItem = styled(ListItem)(({ theme }) => ({
  cursor: 'grab',
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sidebar-tabpanel-${index}`}
      aria-labelledby={`sidebar-tab-${index}`}
      {...other}
      style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `sidebar-tab-${index}`,
    'aria-controls': `sidebar-tabpanel-${index}`,
  };
}

// Define trigger nodes with their icons
const triggerNodes = [
  { id: 'ON_CHAT_START', label: 'On Chat Start', icon: <MessageIcon />, blockType: 'ON_CHAT_START' },
  { id: 'LEAD_FROM_CTWA', label: 'Lead From CTWA', icon: <PersonIcon />, blockType: 'LEAD_FROM_CTWA_V2' },
  { id: 'ON_ABANDONED_CART_WOOCOMMERCE', label: 'On Abandoned Cart', icon: <ShoppingCartIcon />, blockType: 'ON_ABANDONED_CART_WOOCOMMERCE' },
  { id: 'ON_AGENT_ASSIGN', label: 'On Agent Assign', icon: <PersonIcon />, blockType: 'ON_AGENT_ASSIGN' },
  { id: 'ON_ATTRIBUTE_CHANGED', label: 'On Attribute Changed', icon: <EditAttributesIcon />, blockType: 'ON_ATTRIBUTE_CHANGED' },
  { id: 'ON_NEW_ROW_GOOGLE_SHEET', label: 'On New Row Google Sheet', icon: <TableChartIcon />, blockType: 'ON_NEW_ROW_GOOGLE_SHEET' },
];

// Define action nodes with their icons
const actionNodes = [
  { id: 'ADD_REMOVE_TAGS', label: 'Add/Remove Tags', icon: <LocalOfferIcon />, blockType: 'UPDATE_TAG' },
  { id: 'ADD_TO_BROADCAST_LISTS', label: 'Add to Broadcast Lists', icon: <NotificationsIcon />, blockType: 'ADD_TO_BROADCAST_LIST' },
  { id: 'ASSIGN_AGENT', label: 'Assign Agent', icon: <PersonIcon />, blockType: 'ASSIGN_AGENT_V3' },
  { id: 'SEND_MESSAGE', label: 'Send Message', icon: <ChatIcon />, blockType: 'SEND_MESSAGE' },
  { id: 'SEND_INTERACTIVE_MESSAGE', label: 'Send Interactive Message', icon: <SendIcon />, blockType: 'SEND_INTERACTIVE_MESSAGE' },
];

export default function FlowSidebar({ onDragStart }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onDragStartHandler = (event, nodeType, nodeData) => {
    // Include the blockType in the data being transferred
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ 
      type: nodeType, 
      data: {
        ...nodeData,
        blockType: nodeData.blockType // Ensure blockType is included
      } 
    }));
    event.dataTransfer.effectAllowed = 'move';
    
    if (onDragStart) {
      onDragStart(event);
    }
  };

  return (
    <StyledSidebar elevation={0}>
      <Tabs value={value} onChange={handleChange} aria-label="flow sidebar tabs" variant="fullWidth">
        <Tab label="Triggers" {...a11yProps(0)} />
        <Tab label="Actions" {...a11yProps(1)} />
      </Tabs>
      
      <TabPanel value={value} index={0}>
        <Typography variant="subtitle2" gutterBottom>
          Drag a trigger to start your flow (only one allowed)
        </Typography>
        <List>
          {triggerNodes.map((node) => (
            <DraggableItem
              key={node.id}
              draggable
              onDragStart={(event) => onDragStartHandler(event, 'trigger', node)}
            >
              <ListItemIcon>{node.icon}</ListItemIcon>
              <ListItemText primary={node.label} />
            </DraggableItem>
          ))}
        </List>
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        <Typography variant="subtitle2" gutterBottom>
          Drag actions to build your flow
        </Typography>
        <List>
          {actionNodes.map((node) => (
            <DraggableItem
              key={node.id}
              draggable
              onDragStart={(event) => onDragStartHandler(event, 'action', node)}
            >
              <ListItemIcon>{node.icon}</ListItemIcon>
              <ListItemText primary={node.label} />
            </DraggableItem>
          ))}
        </List>
      </TabPanel>
    </StyledSidebar>
  );
}