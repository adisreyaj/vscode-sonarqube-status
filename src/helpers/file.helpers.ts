import { promises as fs } from 'fs';
import { ensureDir, outputJson, readJson } from 'fs-extra';
import { commands, window } from 'vscode';
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
    const fileStat = await fs.stat(`${path}/.vscode/project.json`);
    if (fileStat.isFile()) {
      const config = await readJson(`${path}/.vscode/project.json`);
      const configured = config && isConfigured(config);
      commands.executeCommand('setContext', 'sonarqube-status.isConfigured', configured);
      return config;
    }
    return null;
  } catch (error) {
    commands.executeCommand('setContext', 'sonarqube-status.isConfigured', false);
    return new Error('Failed to fetch config file');
  }
};

export const checkAndCreateConfigFileIfNeeded = async (path: string) => {
  try {
    await ensureDir(`${path}/.vscode`);
    const configFileRes = await getConfigFile(path);
    let configured = false;
    if (configFileRes instanceof Error) {
      window.showErrorMessage(configFileRes.message);
    } else if (configFileRes === null) {
      await createDefaultConfigFile(path);
    } else {
      configured = isConfigured(configFileRes);
    }
    commands.executeCommand('setContext', 'sonarqube-status.isConfigured', configured);
    return configured ? configFileRes : null;
  } catch (error) {
    throw new Error('Failed to configure');
  }
};
