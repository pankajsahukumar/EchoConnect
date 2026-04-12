import withReducer from 'app/store/withReducer';
import reducer from './store';
import MetaOnboardingWizard from './MetaOnboardingWizard';

function MetaOnboardingPage() {
  return <MetaOnboardingWizard />;
}

export default withReducer('metaOnboarding', reducer)(MetaOnboardingPage);
