import { apiClient } from 'src/@api/utils/apiClient';

export const customerApi = {
  async getCustomers(params = {}) {
    return apiClient.get('/api/contacts', {
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 20,
      search: params.search || undefined,
    });
  },

  async getCustomerDetails(contactId) {
    return apiClient.get(`/api/customers/details/${contactId}`);
  },
};
