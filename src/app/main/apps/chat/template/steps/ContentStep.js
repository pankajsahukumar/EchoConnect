import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Alert,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import VideocamIcon from '@mui/icons-material/Videocam';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export default function ContentStep({ template, updateComponent }) {
  // Find existing components or use defaults
  const existingHeader = template.components.find(c => c.type === 'HEADER');
  const initialHeaderType = existingHeader ? existingHeader.format?.toLowerCase() || 'none' : 'none';
  const initialHeaderContent = existingHeader?.text || '';
  const initialHeaderImageUrl = existingHeader?.image?.url || '';
  
  const [headerType, setHeaderType] = useState(initialHeaderType);
  const [headerContent, setHeaderContent] = useState(initialHeaderContent);
  const [headerImageUrl, setHeaderImageUrl] = useState(initialHeaderImageUrl);
  const [bodyContent, setBodyContent] = useState(template.components.find(c => c.type === 'BODY')?.text || '');
  const [footerContent, setFooterContent] = useState(template.components.find(c => c.type === 'FOOTER')?.text || '');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'
  const [previewImage, setPreviewImage] = useState(initialHeaderImageUrl);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);

  // // Extract variables from text (e.g., {{1}}, {{variable_name}})
  // const extractVariablesFromText = (text) => {
  //   const regex = /{{([^}]+)}}/g;
  //   const variables = [];
  //   let match;
    
  //   while ((match = regex.exec(text)) !== null) {
  //     variables.push({
  //       name: match[1],
  //       defaultValue: ''
  //     });
  //   }
    
  //   return variables;
  // };

  useEffect(() => {
    // Update header component based on type
    const headerComponent = {
      type: 'HEADER',
      format: headerType.toUpperCase(),
    };

    if (headerType === 'text') {
      // // Extract variables from header text
      // const variables = extractVariablesFromText(headerContent);
      // const exampleValues = variables.map(v => v.defaultValue || '');
      
      headerComponent.text = headerContent;
      headerComponent.example = {  };
    } else if (headerType === 'none') {
      // No header
    } else if (headerType === 'image') {
      // For image
      headerComponent.image = { url: headerImageUrl || previewImage };
      headerComponent.example = { link:"",fileName:"" };
    } else {
      // For video, document
      headerComponent.example = { header_handle: [headerContent] };
    }

    updateComponent('HEADER', headerComponent);
  }, [headerType, headerContent, headerImageUrl, previewImage]);
  
  useEffect(() => {
    
    const bodyComponent = {
      text: bodyContent,
      example: {
    
      }
    };
    
    updateComponent('BODY', bodyComponent);
  }, [bodyContent]);

  useEffect(() => {
    // Update footer component
    updateComponent('FOOTER', {
      text: footerContent
    });
  }, [footerContent]);

  const handleHeaderTypeChange = (event, newType) => {
    if (newType !== null) {
      setHeaderType(newType);
      setHeaderContent('');
    }
  };

  const handleUploadMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setUploadMethod(newMethod);
    }
  };

  const renderHeaderInput = () => {
    switch (headerType) {
      case 'text':
        return (
          <TextField
            fullWidth
            placeholder="Type header text"
            value={headerContent}
            onChange={(e) => setHeaderContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        );
      case 'image':
        return renderMediaUpload('Image type allowed: JPG, JPEG, PNG', 'Max file size: 5 MB');
      case 'video':
        return renderMediaUpload('Video file', 'Upload a video file');
      case 'document':
        return renderMediaUpload('Document file', 'Upload a document');
      default:
        return null;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadError('');
    
    if (!file) return;
    
    // Check file type for images
    if (headerType === 'image' && !file.type.match('image.*')) {
      setUploadError('Please upload a valid image file (JPG, JPEG, PNG)');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      // In a real app, you would upload the file to a server here
      // and then set the URL from the server response
      setHeaderImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setPreviewImage('');
    setHeaderImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderMediaUpload = (title, subtitle) => {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">{title}</Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        
        <ToggleButtonGroup
          value={uploadMethod}
          exclusive
          onChange={handleUploadMethodChange}
          size="small"
          sx={{ mt: 1, mb: 2 }}
        >
          <ToggleButton value="file">
            <UploadFileIcon fontSize="small" sx={{ mr: 1 }} />
            Upload a file
          </ToggleButton>
          <ToggleButton value="url">
            <LinkIcon fontSize="small" sx={{ mr: 1 }} />
            Enter URL
          </ToggleButton>
        </ToggleButtonGroup>

        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}

        {previewImage && headerType === 'image' ? (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                overflow: 'hidden',
                maxWidth: 320,
                maxHeight: 180
              }}
            >
              <img 
                src={previewImage} 
                alt="Header preview" 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
              />
              <IconButton 
                size="small" 
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
                onClick={handleRemoveImage}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Paper>
          </Box>
        ) : (
          uploadMethod === 'file' ? (
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{ mt: 1 }}
              fullWidth
            >
              Upload image
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </Button>
          ) : (
            <TextField
              fullWidth
              placeholder="Enter image URL"
              value={headerImageUrl}
              onChange={(e) => {
                setHeaderImageUrl(e.target.value);
                setPreviewImage(e.target.value);
              }}
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: headerImageUrl && (
                  <InputAdornment position="end">
                    <Button 
                      size="small" 
                      onClick={() => {
                        setPreviewImage(headerImageUrl);
                      }}
                    >
                      Preview
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Header (Optional)
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Add a title for your message. Your title can't include more than one variable.
        </Typography>

        <ToggleButtonGroup
          value={headerType}
          exclusive
          onChange={handleHeaderTypeChange}
          aria-label="header type"
          sx={{ mt: 2 }}
        >
          <ToggleButton value="none" aria-label="no header">
            None
          </ToggleButton>
          <ToggleButton value="text" aria-label="text header">
            <TextFieldsIcon sx={{ mr: 1 }} />
            Text
          </ToggleButton>
          <ToggleButton value="image" aria-label="image header">
            <ImageIcon sx={{ mr: 1 }} />
            Image
          </ToggleButton>
          <ToggleButton value="video" aria-label="video header">
            <VideocamIcon sx={{ mr: 1 }} />
            Video
          </ToggleButton>
          <ToggleButton value="document" aria-label="document header">
            <InsertDriveFileIcon sx={{ mr: 1 }} />
            Document
          </ToggleButton>
        </ToggleButtonGroup>

        {renderHeaderInput()}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Body Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Body
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          To add a custom variable, please add a variable in double curly brackets without a space.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
          {['1', '2', '3', 'Name', 'Tracking Code', 'Inquiry Code', 'Location', 'experience_name', 'order_id', 'Agent', 'Today', 'Future Date', 'Opt Out'].map((variable) => (
            <Chip 
              key={variable} 
              label={variable} 
              onClick={() => setBodyContent(prev => `${prev} {{${variable}}} `)} 
              variant="outlined" 
              size="small" 
            />
          ))}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Type message body"
          value={bodyContent}
          onChange={(e) => setBodyContent(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="text.secondary">
                  {bodyContent.length}/1024
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Footer Section */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Footer (Optional)
        </Typography>

        <TextField
          fullWidth
          placeholder="Type message footer"
          value={footerContent}
          onChange={(e) => setFooterContent(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="text.secondary">
                  {footerContent.length}/60
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}