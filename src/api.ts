import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AGENTCORE_API_HOST = process.env.AGENTCORE_API_HOST;

export class AgentApi {

    constructor(
        private token: string
    ) {}

    async askAgent(prompt: string): Promise<string> {
        const response = await axios.post(
                `https://${AGENTCORE_API_HOST}`,
                {
                    prompt
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${this.token}`
                    }
                }
            );

        return response.data.response;
    }
}