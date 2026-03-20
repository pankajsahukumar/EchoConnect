import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemButton,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { selectTemplates, deleteTemplate } from './store/templateSlice';

export default function TemplateSidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { templateId } = useParams();
    const templates = useSelector(selectTemplates);

    const [searchText, setSearchText] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const handleCreateTemplate = () => {
        navigate('/apps/templates/create');
    };

    const handleTemplateClick = (template) => {
        navigate(`/apps/templates/edit/${template.id || template.name}`);
    };

    const handleMenuOpen = (event, template) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedTemplate(template);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTemplate(null);
    };

    const handleDeleteTemplate = () => {
        if (selectedTemplate) {
            dispatch(deleteTemplate(selectedTemplate.id || selectedTemplate.name));
            handleMenuClose();
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'marketing':
                return 'primary';
            case 'utility':
                return 'success';
            case 'authentication':
                return 'warning';
            case 'custom':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch = template.name?.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Templates
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={handleCreateTemplate}
                        sx={{
                            bgcolor: '#25D366',
                            '&:hover': {
                                bgcolor: '#128C7E',
                            },
                        }}
                    >
                        New
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search templates..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        },
                    }}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {['all', 'marketing', 'utility', 'authentication'].map((category) => (
                        <Chip
                            key={category}
                            label={category.charAt(0).toUpperCase() + category.slice(1)}
                            size="small"
                            onClick={() => setFilterCategory(category)}
                            color={filterCategory === category ? 'primary' : 'default'}
                            variant={filterCategory === category ? 'filled' : 'outlined'}
                        />
                    ))}
                </Box>
            </Box>

            <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                {filteredTemplates.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            {searchText || filterCategory !== 'all'
                                ? 'No templates found'
                                : 'No templates yet. Create your first template!'}
                        </Typography>
                    </Box>
                ) : (
                    filteredTemplates.map((template) => {
                        const isSelected = templateId === (template.id || template.name);
                        return (
                            <Box key={template.id || template.name}>
                                <ListItem
                                    disablePadding
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, template)}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    }
                                    sx={{
                                        bgcolor: isSelected ? 'action.selected' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                        },
                                    }}
                                >
                                    <ListItemButton onClick={() => handleTemplateClick(template)}>
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        flex: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {template.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                                                <Chip
                                                    label={template.category || 'Unknown'}
                                                    size="small"
                                                    color={getCategoryColor(template.category)}
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                                <Chip
                                                    label={template.status || 'Approved'}
                                                    size="small"
                                                    color={getStatusColor(template.status)}
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {template.language || 'en'} • {template.components?.length || 0} components
                                            </Typography>
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                            </Box>
                        );
                    })
                )}
            </List>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        handleTemplateClick(selectedTemplate);
                        handleMenuClose();
                    }}
                >
                    <FuseSvgIcon size={20} sx={{ mr: 1 }}>heroicons-outline:pencil</FuseSvgIcon>
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                    }}
                >
                    <FuseSvgIcon size={20} sx={{ mr: 1 }}>heroicons-outline:document-duplicate</FuseSvgIcon>
                    Duplicate
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteTemplate} sx={{ color: 'error.main' }}>
                    <FuseSvgIcon size={20} sx={{ mr: 1 }}>heroicons-outline:trash</FuseSvgIcon>
                    Delete
                </MenuItem>
            </Menu>
        </Box>
    );
}
