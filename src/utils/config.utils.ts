import { Exception, ExceptionType } from "../models/exception.model";
import { ConfigDataType, parseConfig } from "../schemas/configs/config.schema";

const config = require("config");

let configuration: ConfigDataType | null;

export const getConfig = (): ConfigDataType => {
    if (configuration) {
        return configuration;
    }

    configuration = parseConfig(config);
    configuration.server.port = process.env.PORT ? parseInt(process.env.PORT) : configuration.server.port;
    if(!configuration){
        throw new Exception(ExceptionType.Config_NotFound, "Config file is not found.", 404);
    }

    return configuration!;
}