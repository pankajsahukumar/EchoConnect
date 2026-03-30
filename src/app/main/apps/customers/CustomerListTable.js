import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

function getAvatarColor(name) {
  if (!name) return '#9e9e9e';
  const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c62828', '#00838f', '#4e342e'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function CustomerListTable({ customers, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
            <TableCell sx={{ ...headerCellSx, width: '22%' }}>Name</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '16%' }}>Phone Number</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '18%' }}>Email</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '18%' }}>Tags</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '13%' }}>Last Message</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '13%' }}>Created Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body1" sx={{ py: 8, color: 'text.secondary' }}>
                  No customers found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow
                key={customer.id}
                hover
                onClick={() => navigate(`/apps/customers/${customer.contactId || customer.id}`)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: '#f8fafb' },
                  '&:last-child td': { border: 0 },
                }}
              >
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={customer.avatar}
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        fontWeight: 600,
                        bgcolor: getAvatarColor(customer.name),
                      }}
                    >
                      {customer.name ? customer.name[0].toUpperCase() : '?'}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#212b36' }}>
                      {customer.name || '-'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography variant="body2" noWrap>
                    {customer.phoneNumber || '-'}
                  </Typography>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography variant="body2" noWrap color="text.secondary">
                    {customer.email || '-'}
                  </Typography>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(customer.tags) && customer.tags.length > 0 ? (
                      <>
                        {customer.tags.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              borderRadius: 999,
                            }}
                          />
                        ))}
                        {customer.tags.length > 2 && (
                          <Chip
                            label={`+${customer.tags.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 22,
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              borderRadius: 999,
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography variant="body2" noWrap>
                    {formatDate(customer.lastMessageAt)}
                  </Typography>
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography variant="body2" noWrap>
                    {formatDate(customer.createdAt)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
