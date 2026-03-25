import { apiClient } from '../utils/apiClient';

// Set to false when real APIs are ready
const USE_DUMMY = true;

// ─── Dummy Data ───────────────────────────────────────────────

const DUMMY_TAGS = [
  { id: 'tag_001', name: 'New Lead', color: '#4CAF50', description: 'Fresh incoming leads', createdAt: '2025-12-10T10:00:00Z' },
  { id: 'tag_002', name: 'Follow Up', color: '#FF9800', description: 'Needs follow up', createdAt: '2025-12-15T10:00:00Z' },
  { id: 'tag_003', name: 'VIP Customer', color: '#9C27B0', description: 'High-value customers', createdAt: '2026-01-05T10:00:00Z' },
  { id: 'tag_004', name: 'Resolved', color: '#2196F3', description: 'Issue has been resolved', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'tag_005', name: 'Pending Payment', color: '#F44336', description: 'Awaiting payment from customer', createdAt: '2026-01-20T10:00:00Z' },
  { id: 'tag_006', name: 'Spam', color: '#795548', description: 'Spam or irrelevant messages', createdAt: '2026-02-01T10:00:00Z' },
  { id: 'tag_007', name: 'Hot Lead', color: '#E91E63', description: 'Ready to convert', createdAt: '2026-02-10T10:00:00Z' },
  { id: 'tag_008', name: 'Feedback', color: '#00BCD4', description: 'Customer feedback received', createdAt: '2026-02-15T10:00:00Z' },
  { id: 'tag_009', name: 'Escalated', color: '#FF5722', description: 'Escalated to senior team', createdAt: '2026-03-01T10:00:00Z' },
  { id: 'tag_010', name: 'Booking Done', color: '#8BC34A', description: 'Booking confirmed by customer', createdAt: '2026-03-10T10:00:00Z' },
];

// ─── API Service ──────────────────────────────────────────────

export const tagApi = {
  async getTags(params = {}) {
    if (USE_DUMMY) {
      let filtered = [...DUMMY_TAGS];
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(search) ||
            (t.description && t.description.toLowerCase().includes(search))
        );
      }
      return { data: { data: filtered } };
    }
    return apiClient.get('/api/tags', params);
  },

  async getTagById(tagId) {
    if (USE_DUMMY) {
      const tag = DUMMY_TAGS.find((t) => t.id === tagId);
      return { data: { data: tag || null } };
    }
    return apiClient.get(`/api/tags/${tagId}`);
  },

  async createTag(payload) {
    if (USE_DUMMY) {
      const newTag = {
        id: `tag_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      return { data: { data: newTag } };
    }
    return apiClient.post('/api/tags', payload);
  },

  async updateTag(tagId, payload) {
    if (USE_DUMMY) {
      const updated = { ...payload, id: tagId };
      return { data: { data: updated } };
    }
    return apiClient.put(`/api/tags/${tagId}`, payload);
  },

  async deleteTag(tagId) {
    if (USE_DUMMY) {
      return { data: { data: { id: tagId } } };
    }
    return apiClient.delete(`/api/tags/${tagId}`);
  },
};
