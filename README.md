# SonarQube Project Status

![SonarQube Status Resulst](images/logo.png)

SonarQube is a static code analyzer for your project. It makes sure your code is up to the mark and will not break in production.

It will only work for **Public** projects which doesn't need any Authentication with the SonarQube server.

A Future release for the private Sonar projects is in roadmap.

This extension can help you get the build status like:

- Quality Gate
- Code Smells
- Bugs
- Code Coverage
- Vulnarabilities

right inside your favorite IDE - VSCode

## How to Use

1. Install the Extension and Make sure it is activated.
1. Open the Command Palette by pression `Ctrl + Shift + P`.
1. Type `Get Build Status`. Click `Enter`.
1. You can see that the configuration file will be created for you in the **.vscode** folder.
1. Add your key in the config file.
1. Comeback and follow the step 2.

Viola....

## Features

![Status Bar Item for Easy insight](images/sonar-status-bar.png)

1. You don't have to go outside the IDE to see the status of the code analysis.
1. Easily accessible from the **Command Palette**
1. Get the details only when you want it.
1. Easily dismissable notifications.
1. Just have to add the project key and sonarqube server URL in the configuration file.

![Access from Command Palette](images/get-sonar-status.png)
![get Simple Notifications](images/sonar-status.png)

## Extension Settings

The extension gets data from a configuration file **.vscode > project.json**

Here is how the configuration file looks:

```json
{
  "project": "sample-project",
  "sonarURL": "sonar.yourserver.com"
}
```

**NOTE:** Please make sure to add `http://` with your sonarURL and should not have a trailing `/`.

For Eg:<br/>
`http://sonar.myserver.com` - **Right** <br/>
`www.sonar.myserver.com/` - **Wrong**

Just fill the file and you are good to go.

**Enjoy!**
