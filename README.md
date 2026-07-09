# cogntio-agentcore-runtime README

This a VSCode extension provides cognito-authenticated integration with AgentCore Runtime to interact with coding-agents.

## Extension Settings

Open your workspace in VS Code.
Go to File > Preferences > Settings (Ctrl+,) and select Workspace.
Search for terminal.integrated.env.windows and edit in settings.json.
Add variables as the following key:value pairs and save.

* "COGNITO_REDIRECT_URI": "vscode://camdang.cognito-agent/auth"
* "COGNITO_CLIENT_ID": "request your AgentCore admin for this ID"
* "COGNITO_DOMAIN": "request your AgentCore admin for this URI"
* "AGENTCORE_API_HOST": "request your AgentCore admin for this DNS"


## Usage

Interact with this extension via the Extension’s Commands in your VSCode (Ctrl + Shift + P).
This extension supports the following commands:

* `agent.login`: - login to cognito
* `agent.logout`: logout of cognito
* `agent.chat`: initiate a chat session with a coding-agent
