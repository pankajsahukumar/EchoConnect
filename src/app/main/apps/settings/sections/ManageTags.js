import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import {
  getTags,
  addTag,
  updateTag,
  deleteTag,
  setSearchText,
  selectTags,
  selectTagsLoading,
  selectTagsSearchText,
} from '../store/tagSlice';

const TAG_COLORS = [
  '#4CAF50', '#FF9800', '#9C27B0', '#2196F3', '#F44336',
  '#795548', '#E91E63', '#00BCD4', '#FF5722', '#8BC34A',
  '#3F51B5', '#009688', '#FFC107', '#607688',
];

export default function ManageTags() {
  const dispatch = useDispatch();
  const tags = useSelector(selectTags);
  const loading = useSelector(selectTagsLoading);
  const searchText = useSelector(selectTagsSearchText);

  const [view, setView] = useState('list');
  const [editingTag, setEditingTag] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tag: null });

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch, searchText]);

  const handleSearchChange = useCallback(
    (value) => dispatch(setSearchText(value)),
    [dispatch]
  );

  const handleAdd = useCallback(() => {
    setEditingTag(null);
    setView('add');
  }, []);

  const handleEdit = useCallback((tag) => {
    setEditingTag(tag);
    setView('edit');
  }, []);

  const handleBack = useCallback(() => {
    setView('list');
    setEditingTag(null);
  }, []);

  const handleSave = useCallback(
    async (formData) => {
      if (view === 'edit' && editingTag) {
        await dispatch(updateTag({ tagId: editingTag.id, tagData: formData }));
      } else {
        await dispatch(addTag(formData));
      }
      setView('list');
      setEditingTag(null);
    },
    [dispatch, view, editingTag]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteDialog.tag) {
      await dispatch(deleteTag(deleteDialog.tag.id));
    }
    setDeleteDialog({ open: false, tag: null });
  }, [dispatch, deleteDialog.tag]);

  if (view === 'add' || view === 'edit') {
    return (
      <TagForm
        tag={editingTag}
        onBack={handleBack}
        onSave={handleSave}
        isEdit={view === 'edit'}
      />
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Manage tags
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tags.length} tag{tags.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleAdd}
          sx={{ textTransform: 'none' }}
        >
          Create new tag
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ px: 3, py: 1.5 }}>
        <TextField
          size="small"
          placeholder="Search tags"
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 260,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { borderColor: 'divider' },
            },
          }}
        />
      </Box>

      {/* Tag List */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, pb: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : tags.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <LocalOfferOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No tags found</Typography>
          </Box>
        ) : (
          tags.map((tag) => (
            <TagCard
              key={tag.id}
              tag={tag}
              onEdit={handleEdit}
              onDelete={(t) => setDeleteDialog({ open: true, tag: t })}
            />
          ))
        )}
      </Box>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, tag: null })}
      >
        <DialogTitle>Delete tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.tag?.name}"? This tag will be removed from all chats. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, tag: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── Tag Card ─────────────────────────────────────────────────

function TagCard({ tag, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        px: 2,
        mb: 1,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        borderLeft: '4px solid',
        borderLeftColor: tag.color || 'primary.main',
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: tag.color || 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LocalOfferOutlinedIcon sx={{ fontSize: 16, color: '#fff' }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {tag.name}
          </Typography>
          {tag.description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {tag.description}
            </Typography>
          )}
        </Box>
      </Box>

      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onEdit(tag);
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete(tag);
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

// ─── Tag Form (Add / Edit) ────────────────────────────────────

function TagForm({ tag, onBack, onSave, isEdit }) {
  const [name, setName] = useState(tag?.name || '');
  const [description, setDescription] = useState(tag?.description || '');
  const [color, setColor] = useState(tag?.color || TAG_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const NAME_MAX = 30;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), description: description.trim(), color });
    setSaving(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <IconButton size="small" onClick={onBack}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600}>
          {isEdit ? 'Edit tag' : 'Create new tag'}
        </Typography>
      </Box>

      {/* Form */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2.5 }}>
        {/* Preview */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            borderLeft: '4px solid',
            borderLeftColor: color,
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {name || 'Tag name'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {description || 'Tag description'}
            </Typography>
          </Box>
        </Box>

        {/* Tag Name */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
            Tag name
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter tag name"
            value={name}
            onChange={(e) => {
              if (e.target.value.length <= NAME_MAX) setName(e.target.value);
            }}
            helperText={`${name.length}/${NAME_MAX}`}
            FormHelperTextProps={{ sx: { textAlign: 'right', mr: 0 } }}
          />
        </Box>

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
            Description
            <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
              {' '}(optional)
            </Typography>
          </Typography>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            placeholder="Add a short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        {/* Color Picker */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Tag color
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {TAG_COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: c,
                  cursor: 'pointer',
                  border: color === c ? '3px solid' : '2px solid transparent',
                  borderColor: color === c ? 'text.primary' : 'transparent',
                  outline: color === c ? '2px solid' : 'none',
                  outlineColor: 'background.paper',
                  transition: 'all 0.15s',
                  '&:hover': { opacity: 0.8 },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!name.trim() || saving}
          sx={{ textTransform: 'none' }}
        >
          {saving ? (
            <CircularProgress size={20} sx={{ color: 'inherit' }} />
          ) : isEdit ? (
            'Save changes'
          ) : (
            'Create tag'
          )}
        </Button>
      </Box>
    </Box>
  );
}
