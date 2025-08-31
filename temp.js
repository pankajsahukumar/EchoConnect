<Paper
square
component="form"
onSubmit={onMessageSubmit}
className="absolute bottom-0 right-0 left-0"
sx={{
  backgroundColor: '#f0f2f5',
  borderTop: 'none',
  padding: '10px 16px',
  boxShadow: 'none',
}}
>
{!!quote && (
  <BoxMui sx={{ 
    mb: 3, 
    mx: 1, 
    p: 3, 
    borderLeft: '4px solid', 
    borderColor: 'primary.main', 
    borderRadius: 3, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2,
    backgroundColor: 'action.hover',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    '& .quote-content': {
      flex: 1,
      minWidth: 0,
    }
  }}>
    <Avatar sx={{ 
      width: 32, 
      height: 32, 
      fontSize: '0.875rem',
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
    }}>
      {(quote.authorName || 'Q')[0]}
    </Avatar>
    <div className="quote-content">
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
        Replying to {quote.authorName || 'message'}
      </Typography>
      <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
        {quote.preview}
      </Typography>
    </div>
    <IconButton 
      size="small" 
      onClick={() => setQuote(null)}
      sx={{ 
        color: 'text.secondary',
        '&:hover': { 
          color: 'error.main',
          backgroundColor: 'error.light',
        }
      }}
    >
      <FuseSvgIcon size={18}>heroicons-outline:x</FuseSvgIcon>
    </IconButton>
  </BoxMui>
)}

<div className="flex items-center relative">
  <IconButton 
    type="button" 
    size="large" 
    onClick={(e) => setAnchorEl(e.currentTarget)}
    sx={{
      color: 'text.secondary',
      width: 48,
      height: 48,
      '&:hover': {
        backgroundColor: 'action.hover',
        color: 'primary.main',
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  >
    <FuseSvgIcon className="text-24">heroicons-outline:paper-clip</FuseSvgIcon>
  </IconButton>

  <AttachmentMenu
    anchorEl={anchorEl}
    onClose={() => setAnchorEl(null)}
    onPickImage={() => {/* TODO: Implement image picker */}}
    onPickVideo={() => {/* TODO: Implement video picker */}}
    onPickAudio={() => {/* TODO: Implement audio picker */}}
    onPickDoc={() => {/* TODO: Implement document picker */}}
    onPickLocation={() => {/* TODO: Implement location picker */}}
    onPickContact={() => {/* TODO: Implement contact picker */}}
    onPickTemplate={handlePickTemplate}
  />

  <InputBase
    autoFocus={false}
    id="message-input"
    className="flex-1 mx-8"
    placeholder="Type a message"
    onChange={onInputChange}
    value={messageText}
    multiline
    maxRows={4}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onMessageSubmit(e);
      }
    }}
    sx={{
      backgroundColor: '#ffffff',
      borderRadius: '21px',
      border: 'none',
      fontSize: '15px',
      minHeight: '42px',
      padding: '9px 12px 11px',
      fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
      '& .MuiInputBase-input': {
        padding: '0',
        fontSize: '15px',
        lineHeight: '20px',
        color: '#111b21',
        '&::placeholder': {
          color: '#8696a0',
          opacity: 1,
        }
      }
    }}
  />

  <IconButton
    type="submit"
    size="small"
    sx={{
      backgroundColor: messageText.trim() ? '#00a884' : 'transparent',
      color: messageText.trim() ? '#ffffff' : '#8696a0',
      width: 42,
      height: 42,
      marginLeft: '8px',
      '&:hover': {
        backgroundColor: messageText.trim() ? '#008f72' : 'rgba(134, 150, 160, 0.1)',
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: '#8696a0',
      },
    }}
    disabled={!messageText.trim()}
  >
    <FuseSvgIcon className="rotate-90">heroicons-outline:paper-airplane</FuseSvgIcon>
  </IconButton>
</div>
</Paper>