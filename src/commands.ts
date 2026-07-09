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
                            const result = await api.askAgent(prompt);
                            const doc = await vscode.workspace.openTextDocument({
                                 content: result,
                                 language: "markdown"
                               });

                            await vscode.window.showTextDocument(doc);
                        }
                    );
            }
        )
    );
}