import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Link,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';

const categories = [
  {
    id: 'MARKETING',
    name: 'Marketing',
    description: 'Send promotions or information about your product, service or business'
  },
  {
    id: 'UTILITY',
    name: 'Utility',
    description: 'Send messages about an existing order or account'
  },
  {
    id: 'AUTHENTICATION',
    name: 'Authentication',
    description: 'Send verification code for transaction confirmation, account login or identity verification'
  }
];

const languages = [
  { code: 'en_US', name: 'English (US)' },
  { code: 'en_GB', name: 'English (UK)' },
  { code: 'es_ES', name: 'Spanish (Spain)' },
  { code: 'es_LA', name: 'Spanish (Latin America)' },
  { code: 'pt_BR', name: 'Portuguese (Brazil)' },
  { code: 'pt_PT', name: 'Portuguese (Portugal)' },
  { code: 'fr_FR', name: 'French' },
  { code: 'de_DE', name: 'German' },
  { code: 'it_IT', name: 'Italian' },
  { code: 'zh_CN', name: 'Chinese (China)' },
  { code: 'zh_TW', name: 'Chinese (Taiwan)' },
  { code: 'ja_JP', name: 'Japanese' },
  { code: 'ko_KR', name: 'Korean' },
  { code: 'ru_RU', name: 'Russian' },
  { code: 'ar_AR', name: 'Arabic' },
  { code: 'hi_IN', name: 'Hindi' },
];

export default function BasicInfoStep({ template, updateTemplate }) {
  const [name, setName] = useState(template.name || '');
  const [category, setCategory] = useState(template.category || 'MARKETING');
  const [language, setLanguage] = useState(template.language || 'en_US');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    // Update parent component when values change
    updateTemplate({ name, category, language });
  }, [name, category, language]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    // Validate name
    if (!value) {
      setNameError('Template name is required');
    } else if (!/^[a-z0-9_]+$/.test(value)) {
      setNameError('Only lower_case, numbers and underscores allowed');
    } else {
      setNameError('');
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Template name
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter template name
        </Typography>
        <TextField
          fullWidth
          placeholder="abandoned_cart"
          value={name}
          onChange={handleNameChange}
          error={!!nameError}
          helperText={nameError || 'Only lower_case, numbers and underscores allowed'}
          sx={{ mt: 1 }}
          inputProps={{ maxLength: 50 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {name.length}/50
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Language
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Select the language for your template
        </Typography>
        
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Category
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Choose a category that describes your message template. <Link href="https://developers.facebook.com/docs/whatsapp/business-platform/guides/message-templates" target="_blank">Learn more about categories</Link>
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
          <RadioGroup
            aria-label="template-category"
            name="template-category"
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <Paper 
                key={cat.id}
                elevation={0} 
                sx={{
                  p: 2, 
                  mb: 2, 
                  border: '1px solid',
                  borderColor: category === cat.id ? 'primary.main' : '#ddd',
                  borderRadius: 1,
                  bgcolor: category === cat.id ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                }}
              >
                <FormControlLabel
                  value={cat.id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">{cat.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cat.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}