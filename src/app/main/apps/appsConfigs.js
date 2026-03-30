import BotFlowConfig from './botflow/BotFlowConfig';
import ChatAppConfig from './chat/ChatAppConfig';
import TemplateAppConfig from './template/TemplateAppConfig';
import CustomersAppConfig from './customers/CustomersAppConfig';
import SettingsAppConfig from './settings/SettingsAppConfig';

const appsConfigs = [
  ChatAppConfig,
  BotFlowConfig,
  TemplateAppConfig,
  CustomersAppConfig,
  SettingsAppConfig,
];

export default appsConfigs;
