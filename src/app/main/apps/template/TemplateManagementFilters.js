import { Box, TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from 'src/Constants/TemplateManagementConstants';

export default function TemplateManagementFilters({
  searchText,
  onSearchChange,
  filters,
  onFilterChange,
  wabaOptions,
  agentOptions,
}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Search template..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 220 }}
      />

      <TextField
        select
        size="small"
        value={filters.waba}
        onChange={(e) => onFilterChange({ waba: e.target.value })}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="all">All WABAs</MenuItem>
        {wabaOptions.map((w) => (
          <MenuItem key={w.id} value={w.id}>
            {w.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        sx={{ minWidth: 130 }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={filters.category}
        onChange={(e) => onFilterChange({ category: e.target.value })}
        sx={{ minWidth: 150 }}
      >
        {CATEGORY_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={filters.agent}
        onChange={(e) => onFilterChange({ agent: e.target.value })}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="all">All agents</MenuItem>
        {agentOptions.map((a) => (
          <MenuItem key={a.id} value={a.id}>
            {a.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
