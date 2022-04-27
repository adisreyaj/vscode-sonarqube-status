import { ensureDir, ensureFile, outputJson, readJson } from 'fs-extra';
import { has, isEmpty } from 'lodash-es';
import { commands } from 'vscode';
import { VSCODE_PROJECT_CONFIG, VSCODE_PROJECT_JSON_FORMAT_OPTIONS } from '../data/constants';
import { Config } from '../interfaces/config.interface';

export function getIsAuthConfigured(config: Config) {
  let isAuthConfigured = true;
  let isPasswordBasedConfigured = false;
  let isTokenBasedConfigured = false;

  if (has(config, 'auth') && !isEmpty(config.auth)) {
    const isAuthUsernameConfigured =
      has(config.auth, 'username') &&
      !isEmpty(config.auth?.username) &&
      !config.auth?.username?.includes('sonar-username');
    const isAuthPasswordConfigured =
      has(config.auth, 'password') &&
      !isEmpty(config.auth?.password) &&
      !config.auth?.password?.includes('sonar-password');
    isTokenBasedConfigured =
      has(config.auth, 'token') &&
      !isEmpty(config.auth?.token) &&
      !config.auth?.token?.includes('sonar-token');

    isPasswordBasedConfigured = isAuthUsernameConfigured && isAuthPasswordConfigured;
    isAuthConfigured = isPasswordBasedConfigured || isTokenBasedConfigured;
  }
  return { isAuthConfigured, type: isTokenBasedConfigured ? 'token' : 'password' };
}

function getIsProjectKeyConfigured(config: Config) {
  return (
    has(config, 'project') && !isEmpty(config.project) && !config.project.includes('your-key-here')
  );
}

function getSonarURLConfigured(config: Config) {
  return (
    has(config, 'sonarURL') &&
    !isEmpty(config.sonarURL) &&
    !config.sonarURL.includes('your-sonar-url')
  );
}

export const isConfigured = (config: Config) => {
  const isProjectKeyConfigured = getIsProjectKeyConfigured(config);
  const isSonarURLConfigured = getSonarURLConfigured(config);
  const { isAuthConfigured, type } = getIsAuthConfigured(config);
  return {
    isConfigured: isProjectKeyConfigured && isSonarURLConfigured && isAuthConfigured,
    isProjectKeyConfigured,
    isSonarURLConfigured,
    isAuthConfigured,
    authType: type,
  };
}

export function isPullRequestOrBranchConfigured(config: Config) {
  const isBranchConfigured = has(config, 'branch') &&
    !config.branch?.includes('optional-branch-name');

  const isPullRequestConfigured = has(config, 'pullRequest') &&
    !config.pullRequest?.includes('optional-pull-request-id');

  if ( isBranchConfigured || isPullRequestConfigured) {
    // Give pullRequest highest priority
    if ( isPullRequestConfigured ) {
      return { pullRequest: config.pullRequest };
    }

    return { branch: config.branch };
  }
};

export const createDefaultConfigFile = async (path: string) => {
  try {
    await outputJson(
      `${path}/.vscode/project.json`,
      VSCODE_PROJECT_CONFIG,
      VSCODE_PROJECT_JSON_FORMAT_OPTIONS
    );
    return VSCODE_PROJECT_CONFIG;
  } catch (error) {
    throw new Error('Failed to create config file');
  }
};

export const getConfigFile = async (path: string) => {
  try {
    await ensureFile(`${path}/.vscode/project.json`);
    const config = await readJson(`${path}/.vscode/project.json`);
    const configured = config && isConfigured(config);
    commands.executeCommand('setContext', 'sonarqube-status.isConfigured', configured);
    return { configured, config };
  } catch (error) {
    commands.executeCommand('setContext', 'sonarqube-status.isConfigured', false);
    return { configured: false, config: null };
  }
};

export const checkAndCreateConfigFileIfNeeded = async (path: string) => {
  try {
    await ensureDir(`${path}/.vscode`);
    let config = null;
    let configured = false;
    const configResult = await getConfigFile(path);
    if (!configResult.configured) {
      config = await createDefaultConfigFile(path);
    } else {
      config = configResult.config;
      configured = configResult.configured;
    }
    commands.executeCommand('setContext', 'sonarqube-status.isConfigured', configResult);
    return { configured, config };
  } catch (error) {
    throw new Error('Failed to configure');
  }
};
