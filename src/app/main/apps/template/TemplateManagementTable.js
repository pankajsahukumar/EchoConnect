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
  fontSize: '0.8rem',
  color: 'text.secondary',
  bgcolor: '#f8f9fa',
  borderBottom: '2px solid',
  borderColor: 'divider',
  whiteSpace: 'nowrap',
  py: 1.5,
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
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          overflow: 'hidden',
          flex: '1 1 auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
        }}
      >
        <TableContainer sx={{ height: '100%', width: '100%' }}>
          <Table stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerCellSx, minWidth: 180 }}>Template name</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 180 }}>Preview</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 160 }}>WABA</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 100 }}>Status</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 130 }}>Created by</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 110 }}>Created on</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 110 }}>Last updated</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 110 }}>Last used on</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 120 }} />
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
                      '&:last-child td': { border: 0 },
                      '& td': { py: 1.5, borderColor: 'divider' },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500} noWrap>
                          {template.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
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
                      onMouseEnter={(e) => handlePreviewOpen(e, template)}
                      onMouseLeave={handlePreviewClose}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 220,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'default',
                        }}
                      >
                        {template.previewText || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {template.waba?.name || '-'}
                      </Typography>
                      {template.waba?.phone && (
                        <Typography variant="caption" color="text.secondary" component="div">
                          {template.waba.phone}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={template.status}
                        size="small"
                        color={STATUS_COLORS[template.status] || 'default'}
                        sx={{ fontSize: '0.65rem', height: 22, fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {template.createdBy?.name || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {formatDate(template.createdOn)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {formatDate(template.lastUpdated)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {formatDate(template.lastUsedOn)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
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
      </Paper>

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
              // Override TemplatePreview's minHeight for compact popover
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
