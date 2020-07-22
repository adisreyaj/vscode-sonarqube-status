import * as vscode from 'vscode';
var Client = require('node-rest-client').Client;
var client = new Client();
let projName: string;
let myStatusBarItem: vscode.StatusBarItem;
import { createNewFile, readFile } from './helpers';

export function activate(context: vscode.ExtensionContext) {
  let myCommandId = 'extension.getBuildStatus';
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    50,
  );
  myStatusBarItem.command = myCommandId;
  let disposable = vscode.commands.registerCommand(myCommandId, async () => {
    await readFile(vscode.workspace.rootPath).then(
      (data) => {
        showResult(data).then();
      },
      (err) => {
        createNewFile(vscode.workspace.rootPath).then();
        vscode.window.showInformationMessage(
          'Hi There, We have created the configuration file inside the .vscode folder. Please change the values and run the command again.',
        );
      },
    );
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(myStatusBarItem);
}

async function showResult(data: any) {
  projName = data.project;
  const sonarURL = `${data.sonarURL}/api/measures/component?metricKeys=coverage,bugs,code_smells,vulnerabilities,alert_status&componentKey=${data.project}`;
  if (projName !== undefined) {
    await client.get(`${sonarURL}`, (data: any, response: any) => {
      if (response.statusCode === 200) {
        data.component.measures.map((element: any) => {
          if (element.metric === 'coverage') {
            if (parseInt(element.value) < 80) {
              vscode.window.showErrorMessage(
                `Code Coverage is ${element.value}%`,
              );
            } else {
              vscode.window.showInformationMessage(
                `Code Coverage is ${element.value}%`,
              );
            }
          } else if (element.metric === 'bugs') {
            vscode.window.showInformationMessage(
              `There are ${element.value} Bugs`,
            );
          } else if (element.metric === 'alert_status') {
            let qualityGate: string;
            if (element.value === 'OK') {
              vscode.window.showInformationMessage(`Quality Gate is Passed`);
              myStatusBarItem.text = `$(megaphone) Sonar Status: Passed $(check)`;
              myStatusBarItem.show();
            } else {
              vscode.window.showErrorMessage('Quality Gate is Failing');
              myStatusBarItem.text = `$(megaphone) Sonar Status: Failed $(x)`;
              myStatusBarItem.show();
            }
          } else if (element.metric === 'code_smells') {
            vscode.window.showInformationMessage(
              `There are ${element.value} Smelly Codes`,
            );
          } else if (element.metric === 'vulnerabilities') {
            vscode.window.showInformationMessage(
              `There are ${element.value} Vulnerabilities`,
            );
          }
        });
      } else {
        vscode.window.showErrorMessage(
          'Please Double Check the project key and sonarURL',
        );
      }
    });
  }
}

export function deactivate() {}
