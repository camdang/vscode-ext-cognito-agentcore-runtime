import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AGENTCORE_API_HOST = process.env.AGENTCORE_API_HOST;

export class AgentApi {

    constructor(
        private token: string
    ) {}

    async askAgent(payload: any): Promise<axios.AxiosResponse<any, any, {}>> {
        const response = await axios.post(
                `https://${AGENTCORE_API_HOST}`,
                payload,
                {
                    timeout: 900000,
                    headers: {
                        Authorization:
                            `Bearer ${this.token}`
                    }
                }
            );

        return response;
    }
}