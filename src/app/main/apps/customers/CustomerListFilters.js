import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function CustomerListFilters({ searchText, onSearchChange }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        size="small"
        placeholder="Search customers..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: 320,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            bgcolor: 'white',
          },
        }}
      />
    </Box>
  );
}
