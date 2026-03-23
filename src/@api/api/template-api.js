import { apiClient } from '../utils/apiClient';

// Set to false when real APIs are ready
const USE_DUMMY = true;

// ─── Dummy Data ───────────────────────────────────────────────

const DUMMY_TEMPLATES = [
  {
    id: 'tmpl_001',
    name: 'cherishx_booking_photo_ready',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'Your CherishX Booking photos are ready 📸📩...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-12-23T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-02-24T09:00:00Z',
    components: [
      { type: 'HEADER', format: 'TEXT', text: 'Your Photos Are Ready!' },
      { type: 'BODY', text: 'Your CherishX Booking photos are ready 📸📩\n\nHi {{1}}, your photos from the {{2}} experience are now available for download.\n\nClick the link below to view and download your memories!' },
      { type: 'FOOTER', text: 'CherishX - Making memories special' },
      { type: 'BUTTON', buttons: [{ text: 'Download Photos', type: 'URL' }] },
    ],
  },
  {
    id: 'tmpl_002',
    name: 'delivery_rider_assigned',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'A {{1}} rider has been assigned. 🚗...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-10-31T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-03-23T09:00:00Z',
    components: [
      { type: 'BODY', text: 'A {{1}} rider has been assigned. 🚗\n\nRider Name: {{2}}\nContact: {{3}}\n\nYour order will arrive in approximately {{4}} minutes.' },
      { type: 'FOOTER', text: 'Thank you for your order' },
    ],
  },
  {
    id: 'tmpl_003',
    name: 'delivery_ride_cancelled',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: '👋 Hello {{1}}, ...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-10-31T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-03-23T09:00:00Z',
    components: [
      { type: 'BODY', text: '👋 Hello {{1}},\n\nWe regret to inform you that your delivery ride has been cancelled.\n\nReason: {{2}}\n\nPlease contact support if you have any questions.' },
      { type: 'FOOTER', text: 'We apologize for the inconvenience' },
      { type: 'BUTTON', buttons: [{ text: 'Contact Support', type: 'PHONE_NUMBER' }] },
    ],
  },
  {
    id: 'tmpl_004',
    name: 'experience_reminder_v2',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'Hey! Just a gentle reminder for your today\'s booking with us...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-10-16T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-03-05T09:00:00Z',
    components: [
      { type: 'HEADER', format: 'TEXT', text: 'Reminder for your upcoming booking' },
      { type: 'BODY', text: 'Hey!\n\nJust a gentle reminder for your today\'s booking with us. So what\'s next?\n\n🙅 We don\'t like to Disturb! Your booking is confirmed. Sit back & relax while we prepare your experience. We will only call you if we need some details. Your booking will be completed within the time slot selected by you while booking....' },
      { type: 'FOOTER', text: 'Keep CherishX-ing!' },
      { type: 'BUTTON', buttons: [{ text: 'Track your Booking', type: 'URL' }] },
    ],
  },
  {
    id: 'tmpl_005',
    name: 'customer_booking_confirmation',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'You are all set to cherish your {{experience_name}}...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-10-16T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: null,
    components: [
      { type: 'HEADER', format: 'TEXT', text: 'Booking Confirmed! 🎉' },
      { type: 'BODY', text: 'You are all set to cherish your {{experience_name}}!\n\nBooking ID: {{booking_id}}\nDate: {{date}}\nTime: {{time}}\nVenue: {{venue}}\n\nWe are excited to make this experience special for you.' },
      { type: 'FOOTER', text: 'CherishX - Making memories' },
      { type: 'BUTTON', buttons: [{ text: 'View Booking', type: 'URL' }] },
    ],
  },
  {
    id: 'tmpl_006',
    name: 'card_party_decorations',
    category: 'MARKETING',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: '🎄💚 Diwali Card Party Just Got Bigger! 🎄❤️...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-10-04T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2025-10-04T09:00:00Z',
    components: [
      { type: 'HEADER', format: 'IMAGE', example: { link: '' } },
      { type: 'BODY', text: '🎄💚 Diwali Card Party Just Got Bigger! 🎄❤️\n\nCelebrate this Diwali with our exclusive card party decorations!\n\n✨ Premium Decorations\n🎊 Party Supplies\n🎁 Gift Hampers\n\nBook now and get 20% OFF!' },
      { type: 'FOOTER', text: 'Limited time offer' },
      { type: 'BUTTON', buttons: [{ text: 'Shop Now', type: 'URL' }, { text: 'Call Us', type: 'PHONE_NUMBER' }] },
    ],
  },
  {
    id: 'tmpl_007',
    name: 'celebration_reminder',
    category: 'MARKETING',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'Hi, your special day is approaching! Since you...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_2', name: 'Subhash Mandal' },
    createdOn: '2025-09-27T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-03-05T09:00:00Z',
    components: [
      { type: 'BODY', text: 'Hi, your special day is approaching! Since you celebrated with us last time, we wanted to make sure this year is even more special.\n\nWe have curated exclusive packages just for you! 🎂🎈\n\nUse code CELEBRATE15 for 15% off.' },
      { type: 'FOOTER', text: 'CherishX Celebrations' },
      { type: 'BUTTON', buttons: [{ text: 'Explore Packages', type: 'URL' }] },
    ],
  },
  {
    id: 'tmpl_008',
    name: 'booking_update_confirmation',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: "Hello {{name}}, there's an important update for yo...",
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-09-17T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2025-09-18T09:00:00Z',
    components: [
      { type: 'HEADER', format: 'TEXT', text: 'Booking Update' },
      { type: 'BODY', text: "Hello {{name}}, there's an important update for your booking.\n\nBooking ID: {{booking_id}}\nUpdated Detail: {{update_detail}}\n\nPlease review the changes and confirm." },
      { type: 'FOOTER', text: 'Thank you for choosing us' },
    ],
  },
  {
    id: 'tmpl_009',
    name: 'event_reminder_support',
    category: 'MARKETING',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'Hello {{Name}}, this is a reminder from CherishX...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-09-10T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-03-21T09:00:00Z',
    components: [
      { type: 'BODY', text: 'Hello {{Name}}, this is a reminder from CherishX.\n\nYour event is scheduled for {{date}}. Please make sure everything is ready.\n\nNeed help? Our support team is here for you!' },
      { type: 'BUTTON', buttons: [{ text: 'Contact Support', type: 'PHONE_NUMBER' }] },
    ],
  },
  {
    id: 'tmpl_010',
    name: 'support_unreachable_alert_v2',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'Dear {{Name}}, ...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_1', name: 'Mayank Singhania' },
    createdOn: '2025-10-08T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-03-23T09:00:00Z',
    components: [
      { type: 'BODY', text: 'Dear {{Name}},\n\nWe tried reaching you regarding your booking but were unable to connect.\n\nPlease call us back at your earliest convenience or reply to this message.' },
      { type: 'FOOTER', text: 'CherishX Support' },
    ],
  },
  {
    id: 'tmpl_011',
    name: 'past_year_greeting',
    category: 'MARKETING',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'Greetings from CherishX, ...',
    waba: { id: 'waba_2', name: 'EchoConnect Business', phone: '9876543210' },
    createdBy: { id: 'user_2', name: 'Subhash Mandal' },
    createdOn: '2025-08-08T10:30:00Z',
    lastUpdated: '2026-02-26T14:00:00Z',
    lastUsedOn: '2026-01-20T09:00:00Z',
    components: [
      { type: 'BODY', text: 'Greetings from CherishX! 🎉\n\nIt\'s been a year since your last celebration with us and we miss you!\n\nLet\'s make more beautiful memories together. Check out our latest experiences.' },
      { type: 'BUTTON', buttons: [{ text: 'Browse Experiences', type: 'URL' }] },
    ],
  },
  {
    id: 'tmpl_012',
    name: 'order_otp_verification',
    category: 'AUTHENTICATION',
    language: 'en',
    languageLabel: 'English',
    status: 'APPROVED',
    previewText: 'Your OTP for order verification is {{1}}. Valid for 10 minutes.',
    waba: { id: 'waba_2', name: 'EchoConnect Business', phone: '9876543210' },
    createdBy: { id: 'user_3', name: 'Pankaj Sahu' },
    createdOn: '2025-11-15T10:30:00Z',
    lastUpdated: '2026-02-20T14:00:00Z',
    lastUsedOn: '2026-03-22T09:00:00Z',
    components: [
      { type: 'BODY', text: 'Your OTP for order verification is {{1}}.\n\nValid for 10 minutes. Do not share this code with anyone.' },
      { type: 'FOOTER', text: 'This is an automated message' },
    ],
  },
  {
    id: 'tmpl_013',
    name: 'welcome_new_user',
    category: 'MARKETING',
    language: 'en',
    languageLabel: 'English',
    status: 'PENDING',
    previewText: 'Welcome to EchoConnect! We are excited to have you...',
    waba: { id: 'waba_2', name: 'EchoConnect Business', phone: '9876543210' },
    createdBy: { id: 'user_3', name: 'Pankaj Sahu' },
    createdOn: '2026-03-20T10:30:00Z',
    lastUpdated: '2026-03-20T10:30:00Z',
    lastUsedOn: null,
    components: [
      { type: 'HEADER', format: 'TEXT', text: 'Welcome! 👋' },
      { type: 'BODY', text: 'Welcome to EchoConnect! We are excited to have you on board.\n\nHere\'s what you can do:\n✅ Connect your WhatsApp Business\n✅ Create message templates\n✅ Start chatting with customers\n\nNeed help getting started?' },
      { type: 'BUTTON', buttons: [{ text: 'Get Started', type: 'URL' }, { text: 'Talk to Support', type: 'PHONE_NUMBER' }] },
    ],
  },
  {
    id: 'tmpl_014',
    name: 'payment_failed_alert',
    category: 'UTILITY',
    language: 'en',
    languageLabel: 'English',
    status: 'REJECTED',
    previewText: 'Hi {{1}}, your payment of ₹{{2}} has failed. Please retry...',
    waba: { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
    createdBy: { id: 'user_2', name: 'Subhash Mandal' },
    createdOn: '2026-03-15T10:30:00Z',
    lastUpdated: '2026-03-18T14:00:00Z',
    lastUsedOn: null,
    components: [
      { type: 'HEADER', format: 'TEXT', text: 'Payment Failed ❌' },
      { type: 'BODY', text: 'Hi {{1}}, your payment of ₹{{2}} has failed.\n\nPlease retry the payment or use an alternate payment method.\n\nOrder ID: {{3}}' },
      { type: 'FOOTER', text: 'Contact support for assistance' },
      { type: 'BUTTON', buttons: [{ text: 'Retry Payment', type: 'URL' }] },
    ],
  },
];

const DUMMY_WABAS = [
  { id: 'waba_1', name: 'Double Tick 8010679679', phone: '8010679679' },
  { id: 'waba_2', name: 'EchoConnect Business', phone: '9876543210' },
];

const DUMMY_AGENTS = [
  { id: 'user_1', name: 'Mayank Singhania' },
  { id: 'user_2', name: 'Subhash Mandal' },
  { id: 'user_3', name: 'Pankaj Sahu' },
];

// ─── Helper: filter dummy data ────────────────────────────────

function filterDummyTemplates(params = {}) {
  let filtered = [...DUMMY_TEMPLATES];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter((t) => t.name.toLowerCase().includes(search));
  }
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((t) => t.status === params.status);
  }
  if (params.category && params.category !== 'all') {
    filtered = filtered.filter((t) => t.category === params.category);
  }
  if (params.waba && params.waba !== 'all') {
    filtered = filtered.filter((t) => t.waba.id === params.waba);
  }
  if (params.agent && params.agent !== 'all') {
    filtered = filtered.filter((t) => t.createdBy.id === params.agent);
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const start = (page - 1) * pageSize;
  const content = filtered.slice(start, start + pageSize);

  return {
    content,
    pagination: { page, pageSize, totalElements, totalPages },
  };
}

// ─── API Service ──────────────────────────────────────────────

export const templateApi = {
  async getTemplates(params = {}) {
    if (USE_DUMMY) {
      const result = filterDummyTemplates(params);
      return { data: { data: { content: result.content, ...result.pagination } } };
    }
    return apiClient.get('/api/templates', params);
  },

  async getTemplateById(templateId) {
    if (USE_DUMMY) {
      const template = DUMMY_TEMPLATES.find((t) => t.id === templateId);
      return { data: { data: template || null } };
    }
    return apiClient.get(`/api/templates/${templateId}`);
  },

  async createTemplate(payload) {
    if (USE_DUMMY) {
      const newTemplate = { id: `tmpl_${Date.now()}`, ...payload, createdOn: new Date().toISOString(), lastUpdated: new Date().toISOString(), lastUsedOn: null };
      return { data: { data: newTemplate } };
    }
    return apiClient.post('/api/templates', payload);
  },

  async updateTemplate(templateId, payload) {
    if (USE_DUMMY) {
      const updated = { ...payload, id: templateId, lastUpdated: new Date().toISOString() };
      return { data: { data: updated } };
    }
    return apiClient.put(`/api/templates/${templateId}`, payload);
  },

  async deleteTemplate(templateId) {
    if (USE_DUMMY) {
      return { data: { data: { id: templateId } } };
    }
    return apiClient.delete(`/api/templates/${templateId}`);
  },

  async getWABAs() {
    if (USE_DUMMY) {
      return { data: { data: DUMMY_WABAS } };
    }
    return apiClient.get('/api/wabas');
  },

  async getAgents() {
    if (USE_DUMMY) {
      return { data: { data: DUMMY_AGENTS } };
    }
    return apiClient.get('/api/agents');
  },
};
