import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import QuickreplyOutlinedIcon from '@mui/icons-material/QuickreplyOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';

const settingsMenuItems = [
  {
    id: 'your-profile',
    slug: 'your-profile',
    title: 'Your profile',
    subtitle: 'Edit your personal details',
    Icon: PersonOutlineIcon,
  },
  {
    id: 'push-notifications',
    slug: 'push-notifications',
    title: 'Push Notifications',
    subtitle: 'Configure desktop notifications',
    Icon: NotificationsNoneOutlinedIcon,
  },
  {
    id: 'email-alerts',
    slug: 'email-alerts',
    title: 'Email alerts',
    subtitle: 'Configure email alerts for your organisation',
    Icon: EmailOutlinedIcon,
  },
  {
    id: 'manage-wabas',
    slug: 'manage-wabas',
    title: 'Manage WABAs',
    subtitle: 'Edit your WABA profile and manage assignees',
    Icon: BusinessOutlinedIcon,
  },
  {
    id: 'chat-activity-logs',
    slug: 'chat-activity-logs',
    title: 'Chat activity logs',
    subtitle: 'See each bot and user activities in chat window',
    Icon: HistoryOutlinedIcon,
  },
  {
    id: 'custom-contact-fields',
    slug: 'custom-contact-fields',
    title: 'Custom Contact Fields',
    subtitle: 'Setup custom fields for your customers',
    Icon: ContactPageOutlinedIcon,
  },
  {
    id: 'pending-requests',
    slug: 'pending-requests',
    title: 'Pending requests',
    subtitle: 'Manage your pending requests',
    Icon: PendingActionsOutlinedIcon,
  },
  {
    id: 'manage-tags',
    slug: 'manage-tags',
    title: 'Manage tags',
    subtitle: 'Edit or delete chat tags',
    Icon: LocalOfferOutlinedIcon,
  },
  {
    id: 'cx-overview',
    slug: 'cx-overview',
    title: 'CX Overview',
    subtitle: 'Manage your CX issues',
    Icon: AssessmentOutlinedIcon,
  },
  {
    id: 'quick-replies',
    slug: 'quick-replies',
    title: 'Quick Replies',
    subtitle: 'Manage your quick replies',
    Icon: QuickreplyOutlinedIcon,
  },
  {
    id: 'whatsapp-widgets',
    slug: 'whatsapp-widgets',
    title: 'WhatsApp widgets',
    subtitle: 'Manage your WhatsApp widget settings',
    Icon: WidgetsOutlinedIcon,
  },
];

export default settingsMenuItems;
