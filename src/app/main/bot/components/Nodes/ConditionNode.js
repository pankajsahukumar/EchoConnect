import React, { useState } from "react";
import {
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import styled from "@emotion/styled";
import { Handle, Position } from "reactflow";
const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  minWidth: 200,
  maxWidth: 220,
  zIndex: 0,
}));
const ConditionNode = ({ data, nodeId }) => {

  console.log(data, nodeId, "this is indfomation");
  return (
    <Container>
         <Handle type="target" position={Position.Left} />
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
            Condition
        </Typography>
        <Box mt={2}>
          <Stack spacing={1}>
            <Box position="relative">
              <Button
                variant="outlined"
                color="success"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                }}
              >
                True
              </Button>
              <Handle
  type="source"
  position={Position.Right}
  id="true"
  style={{
    top: "50%",
    transform: "translateY(-50%)",
    right: -6,
    background: "#10b981",
    zIndex: 10,
  }}
/>

            </Box>
            <Box position="relative">
              <Button
                variant="outlined"
                color="error"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: 500,
                  pr: 4,
                }}
              >
                False
              </Button>
              <Handle
                type="source"
                position={Position.Right}
                id="false"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: -6,
                  background: "#ef4444",
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default ConditionNode;
