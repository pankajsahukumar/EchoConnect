import { useParams, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import YourProfile from './sections/YourProfile';
import PushNotifications from './sections/PushNotifications';
import EmailAlerts from './sections/EmailAlerts';
import ManageWabas from './sections/ManageWabas';
import ChatActivityLogs from './sections/ChatActivityLogs';
import CustomContactFields from './sections/CustomContactFields';
import PendingRequests from './sections/PendingRequests';
import ManageTags from './sections/ManageTags';
import CxOverview from './sections/CxOverview';
import QuickReplies from './sections/QuickReplies';
import WhatsappWidgets from './sections/WhatsappWidgets';

const SECTION_COMPONENTS = {
  'your-profile': YourProfile,
  'push-notifications': PushNotifications,
  'email-alerts': EmailAlerts,
  'manage-wabas': ManageWabas,
  'chat-activity-logs': ChatActivityLogs,
  'custom-contact-fields': CustomContactFields,
  'pending-requests': PendingRequests,
  'manage-tags': ManageTags,
  'cx-overview': CxOverview,
  'quick-replies': QuickReplies,
  'whatsapp-widgets': WhatsappWidgets,
};

export default function SettingsContent() {
  const { section } = useParams();
  const SectionComponent = SECTION_COMPONENTS[section];

  if (!SectionComponent) {
    return <Navigate to="/apps/settings/your-profile" replace />;
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', height: '100%', bgcolor: 'background.paper' }}>
      <SectionComponent />
    </Box>
  );
}
