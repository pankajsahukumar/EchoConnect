import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { IconButton, InputBase } from '@mui/material';
import React from 'react';

const MessageInputV2 = ({ ...props }) => {
//   const { message_input_loading } = useSelector((state: RootState) => state.LoadingSlice);
  return (
  <>
  <InputBase
      multiline
      maxRows={5}
      placeholder="Type a message"
      {...props}
      sx={{ flex: 1 }}
    //   onKeyDown={(e) => {
    //     if (e.key === "Enter" && !e.shiftKey) {
    //       e.preventDefault();
    //       handleSubmit(e);
    //     }
    //   }}
    />
  </>
  );
};

export default MessageInputV2;
