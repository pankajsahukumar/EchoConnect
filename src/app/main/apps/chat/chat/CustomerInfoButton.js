import { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ChatAppContext } from '../ChatApp';

const CustomerInfoButton = ({ className }) => {
  const { setContactSidebarOpen,contactSidebarOpen } = useContext(ChatAppContext);

  return (
    <div className={className}>
      <IconButton
        onClick={() => setContactSidebarOpen(!contactSidebarOpen)}
        size="large"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          backgroundColor: '#fff',
          border: '1px solid rgb(224,224,233)',
          borderRight: 'none',
          borderRadius: '12px 0 0 12px',
          padding: '0 3px 0 11px',
          gap: '8px',
          
          color: 'rgba(0,0,0,0.54)',
          fontSize: '1.125rem',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
      </IconButton>
    </div>
  );
};

export default CustomerInfoButton;
