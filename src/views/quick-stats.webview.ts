import * as vscode from 'vscode';

export class SonarQuickStatsProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }

  public updateMeasures = (measures: any[], qualityGate: any) => {
    this.view?.webview.postMessage({
      type: 'updateMeasures',
      payload: { measures, qualityGate },
    });
  };

  private getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'src/media', 'quick-stats.js')
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'src/media', 'quick-stats.css')
    );

    const nonce = this.getNonce();
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Cat Colors</title>
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <link href="${styleMainUri}" rel="stylesheet">
			</head>
			<body>
        <section class="quality-gate">
          <h2>Quality Gate</h2>
          <div id="quality-gate-container">
            Loading...
          </div>
        </section>
				<section class="measures">
          <h2>Metrics</h2>
          <div id="measures-container">
          Loading...
          </div>
        </section>
				<script nonce="${nonce}" src="${scriptUri}" />
			</body>
			</html>`;
  }

  getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
