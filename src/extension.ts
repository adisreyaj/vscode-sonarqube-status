import * as vscode from "vscode";
var Client = require("node-rest-client").Client;

let myStatusBarItem: vscode.StatusBarItem;
import { createNewFile, Data, readFile } from "./helpers";

export function activate(context: vscode.ExtensionContext) {
  let myCommandId = "extension.getBuildStatus";
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    50
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
          "Hi There, We have created the configuration file inside the .vscode folder. Please change the values and run the command again."
        );
      }
    );
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(myStatusBarItem);
}

type Element = {
  metric: string;
  value: string;
};

async function showResult(data: Data) {
  const sonarURL = `${data.sonarURL}/api/measures/component?metricKeys=coverage,bugs,code_smells,vulnerabilities,alert_status&component=${data.project}`;
  if (data.project !== undefined) {
    let options_auth = { user: data.username, password: data.password };
    let client = new Client(options_auth);

    await client.get(`${sonarURL}`, (data: any, response: any) => {
      console.log({ data });

      if (isStatusCodeNotOk(response.statusCode)) {
        vscode.window.showErrorMessage(
          "Please Double Check the project key and sonarURL"
        );
      }

      data.component.measures.map((element: Element) => {
        classifyElement(element);
      });
    });
  }
}

const classifyElement = (element: Element) => {
  if (isMetricCoverage(element.metric)) {
    if (parseInt(element.value) < 80) {
      vscode.window.showErrorMessage(`Code Coverage is ${element.value}%`);
    } else {
      vscode.window.showInformationMessage(
        `Code Coverage is ${element.value}%`
      );
    }
  }

  if (isMetricBugs(element.metric)) {
    vscode.window.showInformationMessage(`There are ${element.value} Bugs`);
  }

  if (isMetricAlertStatus(element.metric)) {
    if (element.value === "OK") {
      vscode.window.showInformationMessage(`Quality Gate is Passed`);
      myStatusBarItem.text = `$(megaphone) Sonar Status: Passed $(check)`;
      myStatusBarItem.show();
    } else {
      vscode.window.showErrorMessage("Quality Gate is Failing");
      myStatusBarItem.text = `$(megaphone) Sonar Status: Failed $(x)`;
      myStatusBarItem.show();
    }
  }

  if (isMetricCodeSmells(element.metric)) {
    vscode.window.showInformationMessage(
      `There are ${element.value} Smelly Codes`
    );
  }

  if (isMetricVulnerabilities(element.metric)) {
    vscode.window.showInformationMessage(
      `There are ${element.value} Vulnerabilities`
    );
  }
};

const isStatusCodeNotOk = (statusCode: number) => statusCode !== 200;

const isMetricCoverage = (metric: string) => metric === "coverage";

const isMetricBugs = (metric: string) => metric === "bugs";

const isMetricAlertStatus = (metric: string) => metric === "alert_status";

const isMetricCodeSmells = (metric: string) => metric === "code_smells";

const isMetricVulnerabilities = (metric: string) =>
  metric === "vulnerabilities";

export function deactivate() {}
