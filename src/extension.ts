import * as vscode from 'vscode';
import { checkAndCreateConfigFileIfNeeded } from './helpers/file.helpers';
import { getMetrics } from './helpers/sonar.helper';
import { SonarQuickStatsProvider } from './views/quick-stats.webview';

export function activate(context: vscode.ExtensionContext) {
  const commandId = 'extension.getSonarQubeStatus';
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  statusBarItem.command = commandId;
  const quickInfoProvider = new SonarQuickStatsProvider(context.extensionUri);
  const quickInfoWebView = vscode.window.registerWebviewViewProvider(
    'sonarqubeStats.quickInfo',
    quickInfoProvider
  );
  const disposable = vscode.commands.registerCommand(commandId, async () => {
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
  });
  context.subscriptions.push(quickInfoWebView);
  context.subscriptions.push(disposable);
  context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
