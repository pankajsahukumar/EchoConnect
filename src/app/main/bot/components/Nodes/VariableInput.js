import { Chip, IconButton, InputAdornment, List, ListItemButton, ListItemText, Popover, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import CodeIcon from "@mui/icons-material/Code";
const VariableInput = () => {
    const [chips, setChips] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
  
    const variables = ["name", "email", "phone"];
  
    const handleAddChip = (value) => {
      if (value && !chips.includes(value)) {
        setChips([...chips, value]);
      }
    };
  
    const handleDeleteChip = (chipToDelete) => {
      setChips(chips.filter((chip) => chip !== chipToDelete));
    };
  
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && inputValue.trim() !== "") {
        handleAddChip(inputValue.trim());
        setInputValue("");
        e.preventDefault();
      }
    };
  
    const handleOpenPopover = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClosePopover = () => {
      setAnchorEl(null);
    };
  
    const handleSelectVariable = (variable) => {
      handleAddChip(variable);
      handleClosePopover();
    };
  
    const open = Boolean(anchorEl);
  
    return (
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 1,
          minHeight: 50,
        }}
      >
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            onDelete={() => handleDeleteChip(chip)}
            color="success"
            variant="outlined"
          />
        ))}
  
        <TextField
          variant="standard"
          placeholder="Type or select variable"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleOpenPopover}>
                  <CodeIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
  
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <List sx={{ minWidth: 200 }}>
            <ListItemText sx={{ px: 2, pt: 1 }} primary="Assign Variable" />
            {variables.map((variable) => (
              <ListItemButton
                key={variable}
                onClick={() => handleSelectVariable(variable)}
              >
                <ListItemText primary={variable} />
              </ListItemButton>
            ))}
          </List>
        </Popover>
      </Box>
    );
  };
  
  export default VariableInput;
  