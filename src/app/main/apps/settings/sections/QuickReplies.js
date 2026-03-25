import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';

const INITIAL_REPLIES = [
  { id: '1', shortcut: 'check', message: 'Please share your full address; let me check with the team.', visibility: 'everyone', media: null },
  { id: '2', shortcut: '/tables', message: '', visibility: 'everyone', media: { name: 'table-image.jpg', type: 'image' } },
  { id: '3', shortcut: '/ps/confirm reshedule', message: 'We have updated the booking in our system. To avoid any mistakes, please verify and confirm the following details: New Date: New Time Slot: Service: Please reply with \'CONFIRMED\' if the above details are correct.', visibility: 'everyone', media: null },
  { id: '4', shortcut: 'You', message: 'You can this code :- WELCOME5', visibility: 'only_me', media: null },
  { id: '5', shortcut: 'same number', message: 'Please make the booking from same number.', visibility: 'everyone', media: null },
  { id: '6', shortcut: 'This', message: 'This package do you want to book right ?', visibility: 'everyone', media: null },
  { id: '7', shortcut: 'could', message: 'Could you please let me know Any package have you selected from website ?', visibility: 'everyone', media: null },
  { id: '8', shortcut: 'change colour', message: 'sure, Please make the booking on the website; we will change the balloon colors from the backend.', visibility: 'everyone', media: null },
  { id: '9', shortcut: 'possibility', message: 'Please make the booking in 10 mins because of the possibility; otherwise, we will lost the possibility.', visibility: 'everyone', media: null },
  { id: '10', shortcut: 'done', message: 'Decoration will be done in between the time slot.', visibility: 'everyone', media: null },
  { id: '11', shortcut: 'issues', message: 'Please do let me know if you\'re facing any issues while doing the booking.', visibility: 'everyone', media: null },
];

export default function QuickReplies() {
  const [replies, setReplies] = useState(INITIAL_REPLIES);
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [editingReply, setEditingReply] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reply: null });

  const handleAdd = useCallback(() => {
    setEditingReply(null);
    setView('add');
  }, []);

  const handleEdit = useCallback((reply) => {
    setEditingReply(reply);
    setView('edit');
  }, []);

  const handleBack = useCallback(() => {
    setView('list');
    setEditingReply(null);
  }, []);

  const handleSave = useCallback((formData) => {
    if (view === 'edit' && editingReply) {
      setReplies((prev) =>
        prev.map((r) => (r.id === editingReply.id ? { ...r, ...formData } : r))
      );
    } else {
      setReplies((prev) => [
        ...prev,
        { ...formData, id: String(Date.now()) },
      ]);
    }
    setView('list');
    setEditingReply(null);
  }, [view, editingReply]);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.reply) {
      setReplies((prev) => prev.filter((r) => r.id !== deleteDialog.reply.id));
    }
    setDeleteDialog({ open: false, reply: null });
  }, [deleteDialog.reply]);

  const filteredReplies = useMemo(
    () =>
      replies.filter(
        (r) =>
          r.shortcut.toLowerCase().includes(searchText.toLowerCase()) ||
          r.message.toLowerCase().includes(searchText.toLowerCase())
      ),
    [replies, searchText]
  );

  if (view === 'add' || view === 'edit') {
    return (
      <QuickReplyForm
        reply={editingReply}
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
        <Typography variant="h6" fontWeight={600}>
          Quick Replies
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={handleAdd}
          color="primary"
          sx={{ textTransform: 'none' }}
        >
          Add quick reply
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ px: 3, py: 1.5 }}>
        <TextField
          size="small"
          placeholder="Search quick replies"
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
            width: 260,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { borderColor: 'divider' },
            },
          }}
        />
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, pb: 2 }}>
        {filteredReplies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No quick replies found</Typography>
          </Box>
        ) : (
          filteredReplies.map((reply) => (
            <QuickReplyCard
              key={reply.id}
              reply={reply}
              onEdit={handleEdit}
              onDelete={(r) => setDeleteDialog({ open: true, reply: r })}
            />
          ))
        )}
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, reply: null })}
      >
        <DialogTitle>Delete quick reply</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.reply?.shortcut}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, reply: null })}>
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

// --- Quick Reply Card ---
function QuickReplyCard({ reply, onEdit, onDelete }) {
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
        borderLeft: '3px solid',
        borderLeftColor: 'primary.main',
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} noWrap>
          {reply.shortcut}
          {reply.media && (
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              <ImageOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.3 }} />
              1 {reply.media.type === 'image' ? 'Image' : 'File'}
            </Typography>
          )}
        </Typography>
        {reply.message && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {reply.message}
          </Typography>
        )}
      </Box>

      {reply.media?.type === 'image' && (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1,
            flexShrink: 0,
          }}
        >
          <ImageOutlinedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
        </Box>
      )}

      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MoreHorizIcon fontSize="small" />
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
            onEdit(reply);
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
            onDelete(reply);
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

// --- Quick Reply Form (Add / Edit) ---
function QuickReplyForm({ reply, onBack, onSave, isEdit }) {
  const [shortcut, setShortcut] = useState(reply?.shortcut || '');
  const [message, setMessage] = useState(reply?.message || '');
  const [visibility, setVisibility] = useState(reply?.visibility || 'everyone');
  const [media, setMedia] = useState(reply?.media || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const SHORTCUT_MAX = 30;
  const MESSAGE_MAX = 4000;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    const type = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
      ? 'video'
      : file.type === 'application/pdf'
      ? 'pdf'
      : file.type.startsWith('audio/')
      ? 'audio'
      : null;

    if (!type) return;

    setMedia({ name: file.name, type, size: file.size });
  };

  const handleSubmit = () => {
    if (!shortcut.trim()) return;
    onSave({ shortcut: shortcut.trim(), message, visibility, media });
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
          {isEdit ? 'Edit quick reply' : 'Add quick reply'}
        </Typography>
      </Box>

      {/* Form */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2.5 }}>
        {/* Shortcut */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <Typography component="span" variant="body2" fontWeight={600} color="text.primary">
              Shortcut
            </Typography>
            {' '}(A word that will quickly retreive this reply, Max {SHORTCUT_MAX} chars)
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Add word"
            value={shortcut}
            onChange={(e) => {
              if (e.target.value.length <= SHORTCUT_MAX) setShortcut(e.target.value);
            }}
            helperText={`${shortcut.length}/${SHORTCUT_MAX}`}
            FormHelperTextProps={{ sx: { textAlign: 'right', mr: 0 } }}
          />
        </Box>

        {/* Visibility */}
        <FormControl sx={{ mb: 3 }}>
          <FormLabel sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Visibility
          </FormLabel>
          <RadioGroup
            row
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <FormControlLabel
              value="everyone"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'primary.main' } }} />}
              label={<Typography variant="body2">Everyone</Typography>}
            />
            <FormControlLabel
              value="only_me"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'primary.main' } }} />}
              label={<Typography variant="body2">Only Me</Typography>}
            />
          </RadioGroup>
        </FormControl>

        {/* Message */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <Typography component="span" variant="body2" fontWeight={600} color="text.primary">
              Message
            </Typography>
            {' '}
            <Typography component="span" variant="body2" color="text.secondary">
              (Max {MESSAGE_MAX} chars)
            </Typography>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Type your message"
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MESSAGE_MAX) setMessage(e.target.value);
            }}
            helperText={`${message.length}/${MESSAGE_MAX}`}
            FormHelperTextProps={{ sx: { textAlign: 'right', mr: 0 } }}
          />
        </Box>

        {/* Media Upload */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Add Media
          </Typography>

          {media ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.default',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageOutlinedIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">{media.name}</Typography>
              </Box>
              <IconButton size="small" onClick={() => setMedia(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : 'divider',
                borderRadius: 1,
                py: 4,
                px: 2,
                textAlign: 'center',
                bgcolor: isDragging ? 'action.hover' : 'background.default',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/jpeg,image/png,video/mp4,application/pdf,audio/mpeg"
                onChange={(e) => {
                  if (e.target.files[0]) handleFileSelect(e.target.files[0]);
                }}
              />
              <Typography variant="body2" fontWeight={500}>
                Drop image, video, PDF or audio here or
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'primary.main', cursor: 'pointer', mt: 0.5 }}
              >
                Upload from computer
              </Typography>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Image max size: 5MB, Format: JPEG, PNG
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Video max size: 16MB, Format: MP4
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  PDF max size: 100MB
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Audio max size: 16MB, Format: MP3
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!shortcut.trim()}
          color="primary"
          sx={{ textTransform: 'none' }}
        >
          {isEdit ? 'Save changes' : 'Add quick reply'}
        </Button>
      </Box>
    </Box>
  );
}
