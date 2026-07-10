import * as vscode from "vscode";
import { AuthService } from "./auth";
import { AgentApi } from "./api";

export function registerCommands(context: vscode.ExtensionContext, auth: AuthService) {

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "agent.login",
            async () => {
                await auth.login();
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "agent.logout",
            async () => {
                await auth.logout();
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "agent.chat",
            async () => {
                const token = await auth.getAccessToken();
                vscode.window.showInformationMessage(
                    `token: ${token}`
                );

                if (!token) {
                    vscode.window.showErrorMessage("Please login first.");
                    return;
                }

                const prompt = await vscode.window.showInputBox({prompt: "Ask the agent"});
                vscode.window.showInformationMessage(
                    `prompt: ${prompt}`
                );

                if (!prompt) {
                    return;
                }

                const api = new AgentApi(token);

                vscode.window.withProgress(
                        {
                            location:
                            vscode.ProgressLocation.Notification,
                            title: "Agent working..."
                        },
                        async () => {
                            const payload = {
                                prompt
                            };

                            vscode.window.showInformationMessage(
                                `payload: ${JSON.stringify(payload, null, 2)}`
                            );

                            const result = await api.askAgent(payload);

                            if (result.status === 200) {
                                const sessionId = result.data.sessionId;
                                vscode.window.showInformationMessage(
                                    `sessionId: ${sessionId}`
                                );

                                const response = result.data.response;
                                const doc = await vscode.workspace.openTextDocument({
                                    content: response,
                                    language: 'plaintext'
                                });
                                await vscode.window.showTextDocument(doc);
                            } else {
                                vscode.window.showInformationMessage(
                                    `status: ${result.status}/${result.statusText}, message: ${JSON.stringify(result.data, null, 2)}`
                                );
                            }
                        }
                    );
            }
        )
    );
}