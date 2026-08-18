import * as vscode from "vscode";
import { AuthService } from "./auth";
import { AgentApi } from "./api";

export function registerChatParticipant(
    context: vscode.ExtensionContext,
    auth: AuthService
) {
    const handler: vscode.ChatRequestHandler = async (
        request,
        chatContext,
        stream,
        token
    ) => {
        const accessToken = await auth.getAccessToken();

        if (!accessToken) {
            stream.markdown(
                "You're not logged in. Run **Agent Login** from the Command Palette first."
            );
            return;
        }

        stream.progress("Agent working...");

        const api = new AgentApi(accessToken);

        try {
            const result = await api.askAgent({ prompt: request.prompt });

            if (token.isCancellationRequested) {
                return;
            }

            if (result.status === 200) {
                stream.markdown(result.data.response);
            } else {
                stream.markdown(
                    `⚠️ Agent returned status ${result.status}: ${result.statusText}`
                );
            }
        } catch (err: any) {
            stream.markdown(`⚠️ Request failed: ${err.message ?? err}`);
        }
    };

    const participant = vscode.chat.createChatParticipant(
        "camdang.agentcore-chat",
        handler
    );

    context.subscriptions.push(participant);
}