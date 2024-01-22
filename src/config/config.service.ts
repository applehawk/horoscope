import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface"

export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
    private __language_code: string = "en";
     
    constructor() {
        const { error, parsed } = config();
        if (error) {
            throw new Error("Not found .env file");
        }
        if (!parsed) {
            throw new Error("File .env is empty");
        }
        this.config = parsed;
    }
    get(key: string): string {
        const res = this.config[key];
        if(!res) {
            throw new Error("key in config[key] doesn't exist.");
        }
        return res
    }
}