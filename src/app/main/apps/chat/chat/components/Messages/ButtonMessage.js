import React from 'react';
import { Button, Typography } from '@mui/material';
import MuiBox from '@mui/material/Box';



import { Fragment } from "react";



const ButtonMessage = (props) => {
  // ** Props
  const { message, isMine, senderName } = props;
console.log("message", message);
  return (
    <Fragment>
      <MuiBox
        sx={{
          ...(isMine
            ? { float: "right", borderBottomRightRadius: 0 }
            : { float: "left", borderBottomLeftRadius: 0 }),
          maxWidth: "70%",
          borderRadius: 1,
          p: 2,
          backgroundColor: (theme) =>
            isMine ? theme.palette.primary.main : theme.palette.background.paper,
          color: (theme) =>
            isMine ? theme.palette.common.white : theme.palette.text.primary,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            ...(isMine ? { textAlign: "right" } : { textAlign: "left" }),
            color: isMine ? "white" : "#333",
            fontWeight: 600,
            marginBottom: 1,
          }}
        >
          {senderName}
        </Typography>
        <Typography variant="body2">{message.text}</Typography>

        {message.description && (
          <Typography variant="caption" display="block" gutterBottom>
            {message.description}
          </Typography>
        )}

        {/* <Button
          variant={isMine ? "contained" : "outlined"}
          color="primary"
          sx={{ marginTop: 1, width: "100%" }}
        >
          {message.message.text}
        </Button> */}
      </MuiBox>
    </Fragment>
  );
};
export default ButtonMessage;

