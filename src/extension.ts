// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
var Client = require("node-rest-client").Client;
var client = new Client();
var fs = require("fs");
var obj;
let projName: string;
let myStatusBarItem: vscode.StatusBarItem;

import { createNewFile, readFile } from "./helpers";
export function activate(context: vscode.ExtensionContext) {
  let myCommandId = "extension.getBuildStatus";
  let disposable = vscode.commands.registerCommand(myCommandId, async () => {
    await readFile(vscode.workspace.rootPath).then(
      data => {
        showResult(data).then();
      },
      err => {
        createNewFile(vscode.workspace.rootPath).then();
        vscode.window.showInformationMessage(
          "Hi There, We have created the configuration file inside the .vscode folder. Please change the values and run the command again."
        );
      }
    );
  });

  context.subscriptions.push(disposable);
}

// function readFile(): Promise<any> {
//   return new Promise((resolve, reject) => {
//     fs.readFile(
//       `${vscode.workspace.rootPath}/.vscode/project.json`,
//       "utf8",
//       (err: any, data: any) => {
//         if (err) {
//           reject(err);
//         } else {
//           obj = JSON.parse(data);
//           resolve(obj);
//         }
//       }
//     );
//   });
// }

// function createNewFile(): Promise<any> {
//   return new Promise((resolve, reject) => {
//     fs.appendFile(
//       `${vscode.workspace.rootPath}/.vscode/project.json`,
//       `{"project":"<your-key-here>", "sonarURL": "<your-sonar-url>"}`,
//       (err: any, data: any) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(data);
//       }
//     );
//   });
// }

async function showResult(data: any) {
  projName = data.project;
  const sonarURL = `${
    data.sonarURL
  }/api/measures/component?metricKeys=coverage,bugs,code_smells,vulnerabilities,alert_status&componentKey=${
    data.project
  }`;
  if (projName !== undefined) {
    await client.get(`${sonarURL}`, (data: any, response: any) => {
      if (response.statusCode === 200) {
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
      } else {
        vscode.window.showErrorMessage(
          "Please Double Check the project key and sonarURL"
        );
      }
    });
  }
}

function updateStatusBarItem(): void {}

// this method is called when your extension is deactivated
export function deactivate() {}
