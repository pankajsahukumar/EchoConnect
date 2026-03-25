import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import settingsMenuItems from './settingsMenuItems';

export default function SettingsSidebar() {
  const { section } = useParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const filteredItems = settingsMenuItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
          Settings
        </Typography>
        <TextField
          size="small"
          fullWidth
          placeholder="Search settings..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'divider' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
      </Box>
      <Divider />
      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 0.5,
        }}
      >
        {filteredItems.map((item) => {
          const { Icon } = item;
          const isSelected = section === item.slug;
          return (
            <ListItemButton
              key={item.id}
              selected={isSelected}
              onClick={() => navigate(`/apps/settings/${item.slug}`)}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  '&:hover': { bgcolor: 'action.selected' },
                },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon
                  fontSize="small"
                  sx={{ color: isSelected ? 'primary.main' : 'text.secondary' }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                secondary={item.subtitle}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'text.primary' : 'text.primary',
                }}
                secondaryTypographyProps={{
                  fontSize: 12,
                  noWrap: true,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
