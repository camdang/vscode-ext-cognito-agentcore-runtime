# cogntio-agentcore-runtime

This a VSCode extension provides cognito-authenticated integration with AgentCore Runtime to interact with coding-agents.

## Prerequisites

In local Windows development environment, you need to install the following software, recommend the portable versions (i.e., *.zip):

* [VSCode v1.28+](https://code.visualstudio.com/download)
* [NodeJs v24+](https://nodejs.org/en/download)

NOTE: after you have installed NodeJs, make sure its folder containing npm and node scripts (executable commands) is in your %PATH%.

## How to scaffold a new extension project

This section is only meant for learning purpose in understanding the tools to scaffold a new VSCode Extension project.\
After NodeJs has been installed, launch your Windows terminal (CMD or WSL or Git Bash).\
Within your terminal, run the following command to install the following tools for scaffolding your VSCode extension project:

```
    npm install -g yo generator-code
```

Navigate to a folder where you want to setup your project. Then run the generator:

```
    cd path/to/project
    yo code
```
## How to build your extension project

After you have developed your code on top of the scafolding, you need to install the tools for building deployable package of your extension project:

```
    npm install -g vsce
```

Next, compile and test your extension code:

```
    cd path/to/project
    npm install
    npm run pretest
    npm run test
```

Then, build your extension project into a deployable package:

```
    vsce package
```

NOTE: this creates a `cogntio-agentcore-runtime-*.vsix` file at the base of your project folder.

## How to deploy your extension into a VSCode instance

Open your VSCode, then navigate to `File` > `Preferences` > `Extensions`.\
In the `EXTENSIONS` panel located on left frame of your VSCode, click `...` for the dropdown menu.\
Then click `Install from VSIX`, which opens up file explorer pop-up window.\
Navigate to your project folder and select the *.vsix file and click the `Install` button.

### Extension Settings

Add the followings to your Windows Environment Variables:

* "COGNITO_REDIRECT_URI": "vscode://camdang.cognito-agent/auth"
* "COGNITO_CLIENT_ID": "request your AgentCore admin for this ID"
* "COGNITO_DOMAIN": "request your AgentCore admin for this URI"
* "AGENTCORE_API_HOST": "request your AgentCore admin for this DNS"

## Usage

After installing the new *.vsix file, close and reopen your VSCode instance.\
Interact with this extension via the Extension’s Commands in your VSCode (Ctrl + Shift + P).\
This extension supports the following commands:

* `Agent Login`: login to Cognito
* `Agent Chat`: initiate a chat session with a coding-agent
* `Agent Logout`: logout of Cognito
