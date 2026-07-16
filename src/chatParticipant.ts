import * as vscode from "vscode";
import { AuthService } from "./auth";
import { AgentApi } from "./api";

function buildMessageHistory(
    chatContext: vscode.ChatContext
): { role: "user" | "assistant"; content: string }[] {
    const messages: { role: "user" | "assistant"; content: string }[] = [];

    for (const turn of chatContext.history) {
        if (turn instanceof vscode.ChatRequestTurn) {
            messages.push({ role: "user", content: turn.prompt });
        } else if (turn instanceof vscode.ChatResponseTurn) {
            const text = turn.response
                .map(part =>
                    part instanceof vscode.ChatResponseMarkdownPart
                        ? part.value.value
                        : ""
                )
                .join("");
            messages.push({ role: "assistant", content: text });
        }
    }

    return messages;
}

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

        const messages = buildMessageHistory(chatContext);
        messages.push({ role: "user", content: request.prompt });

        try {
            const result = await api.askAgent({ messages });

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