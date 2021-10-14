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
  const startRoutine = async () => {
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
          }
        } catch (error) {
          vscode.window.showErrorMessage('Failed to fetch measures');
        }
      }
    }
  };

  const refresh = () => {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Refreshing Sonarqube report...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 10 });
        await startRoutine();
        progress.report({ increment: 100 });
      }
    );
  };
  context.subscriptions.push(vscode.commands.registerCommand(COMMANDS.getStatus, startRoutine));
  context.subscriptions.push(vscode.commands.registerCommand(COMMANDS.refresh, refresh));
  context.subscriptions.push(quickInfoWebView);
  context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
