import * as vscode from 'vscode';
import { COMMANDS } from './data/constants';
import { checkAndCreateConfigFileIfNeeded } from './helpers/file.helpers';
import { getMetrics } from './helpers/sonar.helper';
import { SonarQuickStatsProvider } from './views/quick-stats.webview';

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  statusBarItem.command = COMMANDS.getStatus;
  const quickInfoProvider = new SonarQuickStatsProvider(context.extensionUri);
  const quickInfoWebView = vscode.window.registerWebviewViewProvider(
    'sonarqubeStatus.quickInfo',
    quickInfoProvider
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.getStatus, getStatusWithProgress)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.refresh, getStatusWithProgress)
  );
  context.subscriptions.push(quickInfoWebView);
  context.subscriptions.push(statusBarItem);

  async function getSonarQubeStatus() {
    const workspace = vscode.workspace.workspaceFolders;
    if (workspace) {
      const config = await checkAndCreateConfigFileIfNeeded(workspace[0].uri.path as string);
      if (config === null) {
        vscode.window.showErrorMessage('Please configure the project first!', 'Okay');
      } else {
        try {
          const data = await getMetrics(config);
          if (data) {
            quickInfoProvider.updateMeasures(
              [
                ...data['Reliability'],
                ...data['Security'],
                ...data['SecurityReview'],
                ...data['Maintainability'],
                ...data['Duplications'],
                ...data['Issues'],
                ...data['Size'],
              ],
              data['Releasability']?.[0]
            );
            const status = data['Releasability']?.[0]?.value;
            let statusBarText = null;
            if (status === 'ERROR') {
              statusBarText = `$(testing-failed-icon) SonarQube: Failed`;
            } else if (status === 'OK') {
              statusBarText = `$(testing-passed-icon) SonarQube: Passed`;
            }
            if (statusBarText) {
              statusBarItem.text = statusBarText;
              statusBarItem.show();
            } else {
              statusBarItem.hide();
            }
          }
        } catch (error) {
          vscode.window.showErrorMessage('Failed to fetch measures');
        }
      }
    }
  }

  function getStatusWithProgress() {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Refreshing Sonarqube report...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 10 });
        await getSonarQubeStatus();
        progress.report({ increment: 100 });
      }
    );
  }
}

export function deactivate() {}
