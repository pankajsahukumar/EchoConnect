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
import { useTemplate } from 'src/hooks/useTemplate';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import VideocamIcon from '@mui/icons-material/Videocam';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { TEMPLATE_STEPS } from 'src/Constants/TemplateStepContants';
import { apiClient } from 'src/@api/utils/apiClient';

export default function ContentStep({ template, updateComponent, validateCurrentStep }) {
  const [validationError, setValidationError] = useState('');
  const existingHeader = template?.components?.find(c => c.type === 'HEADER');
  const initialHeaderType = existingHeader ? existingHeader.format?.toLowerCase() || 'none' : 'none';
  const initialHeaderContent = existingHeader?.text || '';
  const initialHeaderImageUrl = existingHeader?.image?.url || '';

  const [headerType, setHeaderType] = useState(initialHeaderType);
  const [headerContent, setHeaderContent] = useState(initialHeaderContent);
  const [headerImageUrl, setHeaderImageUrl] = useState(initialHeaderImageUrl);
  const [bodyContent, setBodyContent] = useState(template?.components?.find(c => c.type === 'BODY')?.text || '');
  const [footerContent, setFooterContent] = useState(template?.components?.find(c => c.type === 'FOOTER')?.text || '');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'
  const [previewImage, setPreviewImage] = useState(initialHeaderImageUrl);
  const [uploadError, setUploadError] = useState('');
  const { errors } = useTemplate();
  const stepErrors = errors[TEMPLATE_STEPS.CONTENT.key] || {};
  const fileInputRef = useRef(null);

  const [headerError, setHeaderError] = useState('');

  const validateContent = () => {
    if (validateCurrentStep) {
      const result = validateCurrentStep();
      setValidationError(result.isValid ? '' : result.error);
    }
  };

  // Update HEADER component in store whenever relevant states change
  useEffect(() => {
    const headerComponent = { type: 'HEADER', format: headerType.toUpperCase() };

    if (headerType === 'text') {
      headerComponent.text = headerContent;
      headerComponent.example = {};
    } else if (headerType === 'image') {
      headerComponent.image = { url: headerImageUrl || previewImage };
      headerComponent.example = { link: "", fileName: "" };
    } else if (headerType === 'video') {
      headerComponent.video = { url: headerContent };
      headerComponent.example = { video_handle: "" };
    } else if (headerType === 'document') {
      headerComponent.document = { url: headerContent };
      headerComponent.example = { document_handle: "" };
    }

    updateComponent('HEADER', headerComponent);
    validateContent();
  }, [headerType, headerContent, headerImageUrl, previewImage]);

  // Header validation
  useEffect(() => {
    if (headerType === 'none') setHeaderError('');
    else if (headerType === 'text' && !headerContent.trim()) setHeaderError('Header text is required');
    else if (headerType === 'image' && !headerImageUrl.trim() && !previewImage.trim()) setHeaderError('Header image is required');
    else if ((headerType === 'video' || headerType === 'document') && !headerContent.trim())
      setHeaderError(`${headerType.charAt(0).toUpperCase() + headerType.slice(1)} header is required`);
    else setHeaderError('');
  }, [headerType, headerContent, headerImageUrl, previewImage]);

  // Update BODY component
  useEffect(() => {
    updateComponent('BODY', { text: bodyContent, example: {} });
    validateContent();
  }, [bodyContent]);

  // Update FOOTER component
  useEffect(() => {
    updateComponent('FOOTER', { text: footerContent });
  }, [footerContent]);

  const handleHeaderTypeChange = (event, newType) => {
    if (newType !== null) {
      setHeaderType(newType);
      setHeaderContent('');
      setHeaderImageUrl('');
      setPreviewImage('');
    }
  };

  const handleUploadMethodChange = (event, newMethod) => {
    if (newMethod !== null) setUploadMethod(newMethod);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setUploadError('');
    if (!file) return;
     console.log("this is getting called with the file name in this",file);
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/jpg'],
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    };

    if (!allowedTypes[headerType]?.includes(file.type)) {
      setUploadError(`Please upload a valid ${headerType} file`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      return;
    }
    const response=await apiClient.get("/api/get/url",{
      fileName: file.name,
      fileType: file.type,
    })
    let presignedUrl=response.data.signedUrl;
   await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    console.log(response,"this is response i am getting")
    const reader = new FileReader();
    reader.onload = (e) => {
      if (headerType === 'image') {
        setHeaderImageUrl(e.target.result);
        setPreviewImage(e.target.result);
      } else {
        setHeaderContent(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    setHeaderImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderMediaUpload = (title, subtitle) => (
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

      {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}

      {uploadMethod === 'file' ? (
        <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
          Upload {headerType.charAt(0).toUpperCase() + headerType.slice(1)}
          <input
            type="file"
            hidden
            accept={
              headerType === 'image' ? 'image/*' :
              headerType === 'video' ? 'video/*' :
              headerType === 'document' ? '.pdf,.doc,.docx' : ''
            }
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </Button>
      ) : (
        <TextField
          fullWidth
          placeholder={`Enter ${headerType} URL`}
          value={headerType === 'image' ? headerImageUrl : headerContent}
          onChange={(e) => {
            if (headerType === 'image') setHeaderImageUrl(e.target.value);
            else setHeaderContent(e.target.value);
          }}
          sx={{ mt: 1 }}
        />
      )}

      {headerType === 'image' && previewImage && (
        <Box sx={{ mt: 2, maxWidth: 320, position: 'relative' }}>
          <img src={previewImage} alt="preview" style={{ width: '100%' }} />
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
            onClick={handleRemoveImage}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );

  const renderHeaderInput = () => {
    switch (headerType) {
      case 'text':
        return <TextField fullWidth placeholder="Type header text" value={headerContent} onChange={(e) => setHeaderContent(e.target.value)} sx={{ mt: 2 }} />;
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
          <ToggleButton value="none" aria-label="no header">None</ToggleButton>
          <ToggleButton value="text" aria-label="text header"><TextFieldsIcon sx={{ mr: 1 }} />Text</ToggleButton>
          <ToggleButton value="image" aria-label="image header"><ImageIcon sx={{ mr: 1 }} />Image</ToggleButton>
          <ToggleButton value="video" aria-label="video header"><VideocamIcon sx={{ mr: 1 }} />Video</ToggleButton>
          <ToggleButton value="document" aria-label="document header"><InsertDriveFileIcon sx={{ mr: 1 }} />Document</ToggleButton>
        </ToggleButtonGroup>

        {headerError && <Alert severity="error" sx={{ mt: 1 }}>{headerError}</Alert>}

        {renderHeaderInput()}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Body Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Body</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          To add a custom variable, please add a variable in double curly brackets without a space.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
          {['1','2','3','Name','Tracking Code','Inquiry Code','Location','experience_name','order_id','Agent','Today','Future Date','Opt Out'].map((variable) => (
            <Chip key={variable} label={variable} onClick={() => setBodyContent(prev => `${prev} {{${variable}}} `)} variant="outlined" size="small" />
          ))}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Type message body"
          value={bodyContent}
          error={!!stepErrors.body}
          onChange={(e) => setBodyContent(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="text.secondary">{bodyContent.length}/1024</Typography>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Footer Section */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Footer (Optional)</Typography>
        <TextField
          fullWidth
          placeholder="Type message footer"
          value={footerContent}
          onChange={(e) => setFooterContent(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="text.secondary">{footerContent.length}/60</Typography>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}
