import { ensureDir, ensureFile, outputJson, readJson } from 'fs-extra';
import { commands } from 'vscode';
import { VSCODE_PROJECT_CONFIG } from '../data/constants';
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

export const createDefaultConfigFile = async (path: string) => {
  try {
    await outputJson(`${path}/.vscode/project.json`, VSCODE_PROJECT_CONFIG);
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
