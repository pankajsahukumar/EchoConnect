import { useState } from 'react';
import {
  Box,
  Typography,
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
  CircularProgress,
  Popover,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteTemplate, getTemplates } from './store/templateSlice';
import { STATUS_COLORS, CATEGORY_COLORS } from 'src/Constants/TemplateManagementConstants';
import TemplatePreview from './TemplatePreview';

const headerCellSx = {
  fontWeight: 600,
  fontSize: '0.75rem',
  color: '#637381',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  bgcolor: '#f4f6f8',
  borderBottom: '1px solid',
  borderColor: '#e0e0e0',
  whiteSpace: 'nowrap',
  py: 1.5,
  px: 2,
  '&:first-of-type': { pl: 3 },
  '&:last-of-type': { pr: 3 },
};

const bodyCellSx = {
  py: 1.8,
  px: 2,
  borderBottom: '1px solid',
  borderColor: '#f0f0f0',
  '&:first-of-type': { pl: 3 },
  '&:last-of-type': { pr: 3 },
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function TemplateManagementTable({ templates, loading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewAnchor, setPreviewAnchor] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handlePreviewOpen = (event, template) => {
    setPreviewAnchor(event.currentTarget);
    setPreviewTemplate(template);
  };

  const handlePreviewClose = () => {
    setPreviewAnchor(null);
    setPreviewTemplate(null);
  };

  const handleDelete = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch(deleteTemplate(templateId)).then(() => {
        dispatch(getTemplates());
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        sx={{
          flex: '1 1 auto',
          overflow: 'auto',
          width: '100%',
          border: '1px solid',
          borderColor: '#e0e0e0',
          borderRadius: '8px',
          bgcolor: 'white',
        }}
      >
        <Table stickyHeader sx={{ width: '100%', tableLayout: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellSx, width: '18%' }}>Template name</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '18%' }}>Preview</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '14%' }}>WABA</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '8%' }}>Status</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '10%' }}>Created by</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '10%' }}>Created on</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '10%' }}>Last updated</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '8%' }}>Last used on</TableCell>
              <TableCell sx={{ ...headerCellSx, width: '4%', textAlign: 'right' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" sx={{ py: 8, color: 'text.secondary' }}>
                    No templates found. Create your first template to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow
                  key={template.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                    '&:hover': { bgcolor: '#f8fafb' },
                    '&:last-child td': { border: 0 },
                  }}
                >
                  <TableCell sx={bodyCellSx}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#212b36', mb: 0.5 }}>
                        {template.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          label={template.category}
                          size="small"
                          color={CATEGORY_COLORS[template.category] || 'default'}
                          variant="outlined"
                          sx={{ fontSize: '0.6rem', height: 18, fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {template.languageLabel || template.language}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={bodyCellSx}
                    onMouseEnter={(e) => handlePreviewOpen(e, template)}
                    onMouseLeave={handlePreviewClose}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'default',
                      }}
                    >
                      {template.previewText || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {template.waba?.name || '-'}
                    </Typography>
                    {template.waba?.phone && (
                      <Typography variant="caption" color="text.secondary" component="div">
                        {template.waba.phone}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Chip
                      label={template.status}
                      size="small"
                      color={STATUS_COLORS[template.status] || 'default'}
                      sx={{ fontSize: '0.65rem', height: 22, fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Typography variant="body2" noWrap>
                      {template.createdBy?.name || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Typography variant="body2" noWrap>
                      {formatDate(template.createdOn)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Typography variant="body2" noWrap>
                      {formatDate(template.lastUpdated)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Typography variant="body2" noWrap>
                      {formatDate(template.lastUsedOn)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>
                    <Tooltip title="View">
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/apps/templates/edit/${template.id}`);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(template.id);
                        }}
                      >
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

      {/* Preview Popover on hover */}
      <Popover
        sx={{ pointerEvents: 'none' }}
        open={Boolean(previewAnchor)}
        anchorEl={previewAnchor}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        onClose={handlePreviewClose}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              pointerEvents: 'none',
              maxWidth: 360,
              maxHeight: 500,
              overflow: 'auto',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              '& .MuiBox-root': {
                minHeight: 'unset !important',
              },
            },
          },
        }}
      >
        {previewTemplate && <TemplatePreview template={previewTemplate} />}
      </Popover>
    </>
  );
}
