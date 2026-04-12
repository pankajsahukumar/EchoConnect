import BotFlowConfig from './botflow/BotFlowConfig';
import ChatAppConfig from './chat/ChatAppConfig';
import TemplateAppConfig from './template/TemplateAppConfig';
import CustomersAppConfig from './customers/CustomersAppConfig';
import SettingsAppConfig from './settings/SettingsAppConfig';
import MetaOnboardingConfig from '../meta-onboarding/MetaOnboardingConfig';

const appsConfigs = [
  ChatAppConfig,
  BotFlowConfig,
  TemplateAppConfig,
  CustomersAppConfig,
  SettingsAppConfig,
  MetaOnboardingConfig,
];

export default appsConfigs;
