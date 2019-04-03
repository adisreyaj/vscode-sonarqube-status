// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
var Client = require("node-rest-client").Client;
var client = new Client();
var fs = require("fs");
var obj;
let projName: string;
let myStatusBarItem: vscode.StatusBarItem;
export function activate(context: vscode.ExtensionContext) {
  let myCommandId = "extension.getBuildStatus";
  let disposable = vscode.commands.registerCommand(myCommandId, async () => {
    await readFile().then(
      data => {
        showResult(data).then();
      },
      err => {
        createNewFile().then();
      }
    );
  });

  context.subscriptions.push(disposable);

  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBarItem.command = myCommandId;
  context.subscriptions.push(myStatusBarItem);

  // register some listener that make sure the status bar
  // item always up-to-date
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
  );
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
  );

  // update status bar item once at start
  updateStatusBarItem();
}

function readFile(): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${vscode.workspace.rootPath}/.vscode/project.json`,
      "utf8",
      (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          obj = JSON.parse(data);
          resolve(obj);
        }
      }
    );
  });
}

function createNewFile(): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.appendFile(
      `${vscode.workspace.rootPath}/.vscode/project.json`,
      `{"project":"<your-key-here>", "sonarURL": "<your-sonar-url>"}`,
      (err: any, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
}

async function showResult(data: any) {
  projName = data.project;
  const sonarURL = `${
    data.sonarURL
  }/api/measures/component?metricKeys=coverage,bugs,code_smells,vulnerabilities,alert_status&componentKey=${
    data.project
  }`;
  if (projName !== undefined) {
    await client.get(`${sonarURL}`, (data: any, response: any) => {
      data.component.measures.map((element: any) => {
        if (element.metric === "coverage") {
          if (parseInt(element.value) < 80) {
            vscode.window.showErrorMessage(
              `Code Coverage is ${element.value}%`
            );
          } else {
            vscode.window.showInformationMessage(
              `Code Coverage is ${element.value}%`
            );
          }
        } else if (element.metric === "bugs") {
          vscode.window.showInformationMessage(
            `There are ${element.value} Bugs`
          );
        } else if (element.metric === "alert_status") {
          let qualityGate: string;
          if (element.value === "OK") {
            vscode.window.showInformationMessage(`Quality Gate is Passed`);
          } else {
            vscode.window.showErrorMessage("Quality Gate is Failing");
          }
        } else if (element.metric === "code_smells") {
          vscode.window.showInformationMessage(
            `There are ${element.value} Smelly Codes`
          );
        } else if (element.metric === "vulnerabilities") {
          vscode.window.showInformationMessage(
            `There are ${element.value} Vulnerabilities`
          );
        }
      });
      // data.component.measures.forEach((element: any) => {
      //   vscode.window.showInformationMessage(
      //     `${element.metric}: ${element.value}`
      //   );
      // });
    });
  }
}

function updateStatusBarItem(): void {}

// this method is called when your extension is deactivated
export function deactivate() {}
