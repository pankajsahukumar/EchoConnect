import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getTemplates, selectTemplates } from '../store/templateSlice';
import TemplatePreview from '../TemplateMessageComponent/TemplatePreview';

export default function TemplateList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const templates = useSelector(selectTemplates);

  useEffect(() => {
    dispatch(getTemplates());
  }, [dispatch]);

  const handleCreateTemplate = () => {
    navigate('/apps/chat/templates/create');
  };

  const handleEditTemplate = (templateId) => {
    navigate(`/apps/chat/templates/edit/${templateId}`);
  };

  const handleViewTemplate = (templateId) => {
    // Implement template preview logic
    console.log('View template:', templateId);
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

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">WhatsApp Templates</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateTemplate}
        >
          Create Template
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', flexGrow: 1 }}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" sx={{ py: 5 }}>
                      No templates found. Create your first template to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id || template.name}>
                    <TableCell component="th" scope="row">
                      {template.name}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={template.category || 'Unknown'} 
                        color={getCategoryColor(template.category)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{template.language || 'en'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={template.status || 'Approved'} 
                        color={template.status === 'Rejected' ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Template">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewTemplate(template.id || template.name)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Template">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTemplate(template.id || template.name)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Template">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}