import { useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTemplates,
  getWABAs,
  getAgents,
  selectTemplates,
  selectLoading,
  selectSearchText,
  selectTemplateFilters,
  selectWabaOptions,
  selectAgentOptions,
  setSearchText,
  setFilters,
} from './store/templateSlice';
import TemplateManagementHeader from './TemplateManagementHeader';
import TemplateManagementFilters from './TemplateManagementFilters';
import TemplateManagementTable from './TemplateManagementTable';

export default function TemplateManagement() {
  const dispatch = useDispatch();
  const templates = useSelector(selectTemplates);
  const loading = useSelector(selectLoading);
  const searchText = useSelector(selectSearchText);
  const filters = useSelector(selectTemplateFilters);
  const wabaOptions = useSelector(selectWabaOptions);
  const agentOptions = useSelector(selectAgentOptions);

  useEffect(() => {
    dispatch(getTemplates());
    dispatch(getWABAs());
    dispatch(getAgents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTemplates());
  }, [dispatch, searchText, filters]);

  const handleSearchChange = useCallback(
    (value) => {
      dispatch(setSearchText(value));
    },
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <TemplateManagementHeader />
      <TemplateManagementFilters
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        wabaOptions={wabaOptions}
        agentOptions={agentOptions}
      />
      <TemplateManagementTable templates={templates} loading={loading} />
    </Box>
  );
}
