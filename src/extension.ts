import * as vscode from "vscode";
import { AuthService } from "./auth";
import { registerCommands } from "./commands";
import { registerChatParticipant } from "./chatParticipant";

export async function activate(context: vscode.ExtensionContext) {

    const auth = new AuthService(context);

    registerCommands(context, auth);
    registerChatParticipant(context, auth);

    const handler: vscode.UriHandler = {
        async handleUri(uri: vscode.Uri): Promise<void> {
            await auth.handleCallback(uri);
        }
    };

    vscode.window.registerUriHandler(handler);

    console.log("Cognito Agent started");
}

export function deactivate() {}