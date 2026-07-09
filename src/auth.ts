import * as vscode from "vscode";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.COGNITO_CLIENT_ID || "";
const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN || "";
const REDIRECT_URI = process.env.COGNITO_REDIRECT_URI || "";

export class AuthService {

    constructor(
        private context: vscode.ExtensionContext
    ) {}

    async login(): Promise<void> {

        const authUrl =
            `${COGNITO_DOMAIN}/login` +
            `?client_id=${CLIENT_ID}` +
            `&response_type=code` +
            `&scope=openid+email+profile` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

        vscode.window.showInformationMessage(
            `Logging in to ${authUrl}`
        );

        await vscode.env.openExternal(
            vscode.Uri.parse(authUrl)
        );

        vscode.window.showInformationMessage(
            "Waiting for Cognito login..."
        );
    }

    async handleCallback(uri: vscode.Uri): Promise<void> {

        const query = new URLSearchParams(uri.query);
        const code = query.get("code");

        vscode.window.showInformationMessage(
            `Handling callback with query: ${query}`
        );

        if (!code) {
            return;
        }

        const tokenResponse = await axios.post(
                `${COGNITO_DOMAIN}/oauth2/token`,
                new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id: CLIENT_ID,
                    code: code,
                    redirect_uri: REDIRECT_URI
                }),
                {
                    headers: {
                        "Content-Type":
                        "application/x-www-form-urlencoded"
                    }
                }
            );

        await this.context.secrets.store(
            "access_token",
            tokenResponse.data.access_token
        );

        await this.context.secrets.store(
            "id_token",
            tokenResponse.data.id_token
        );

        await this.context.secrets.store(
            "refresh_token",
            tokenResponse.data.refresh_token
        );

        vscode.window.showInformationMessage(
            "Authentication successful."
        );
    }

    async logout(): Promise<void> {

        vscode.window.showInformationMessage(
            "Logging out..."
        );

        await this.context.secrets.delete("access_token");
        await this.context.secrets.delete("id_token");
        await this.context.secrets.delete("refresh_token");

        vscode.window.showInformationMessage(
            "Logged out."
        );
    }

    async getAccessToken():
        Promise<string | undefined> {

        return this.context.secrets.get("access_token");
    }
}