import { Config } from '../interfaces/config.interface';
import { has } from '../utils/general.util';

const isConfigured = (config: Config) => {
  const isProjectKeyConfigured =
    has(config, 'project') && !config.project.includes('your-key-here');
  const isSonarURLConfigured =
    has(config, 'sonarURL') && !config.sonarURL.includes('your-sonar-url');
  let isAuthConfigured = true;
  if (has(config, 'auth')) {
    const isAuthUsernameConfigured =
      (has(config.auth, 'username') && config.auth?.username.includes('sonar-username')) ?? false;
    const isAuthPasswordConfigured =
      (has(config.auth, 'password') && config.auth?.username.includes('sonar-password')) ?? false;
    isAuthConfigured = isAuthUsernameConfigured && isAuthPasswordConfigured;
  }
  return isProjectKeyConfigured && isSonarURLConfigured && isAuthConfigured;
};

export const some = () => {};
