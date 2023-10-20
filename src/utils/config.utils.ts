import { Exception, ExceptionType } from "../models/exception.model";
import { ConfigDataType, parseConfig } from "../schemas/configs/config.schema";

const config = require("config");

let configuration: ConfigDataType | null;
const populateConfigFromEnv = (configuration: (ConfigDataType)) => {

    const { PORT, CACHE_HOST, CACHE_PORT, CACHE_DB, RESPONSE_CACHE_MONGOURL, CLIENT_TYPE, WEBHOOK_URL, GATEWAY_INBOX_QUEUE, GATEWAY_OUTBOX_QUEUE, GATEWAY_AMQPURL, PRIVATE_KEY, PUBLIC_KEY, SUBSCRIBER_ID, SUBSCRIBER_URI, REGISTRY_URL, AUTH, UNIQUE_KEY, CITY, COUNTRY, HTTP_RETRY_COUNT } = process.env;

    // Format subject to change if default config changes
    configuration.server.port = PORT ? parseInt(PORT) : configuration.server.port;
    configuration.cache.host = CACHE_HOST ? CACHE_HOST : configuration.cache.host;
    configuration.cache.port = CACHE_PORT ? parseInt(CACHE_PORT) : configuration.cache.port;
    configuration.cache.db = CACHE_DB ? parseInt(CACHE_DB) : configuration.cache.db;
    configuration.responseCache.mongoURL = RESPONSE_CACHE_MONGOURL ? RESPONSE_CACHE_MONGOURL : configuration.responseCache.mongoURL;
    // @ts-expect-error 
    configuration.client.type = CLIENT_TYPE ? CLIENT_TYPE : configuration.client.type;
    // @ts-expect-error Property 'url' does not exist 
    configuration.client.connection.url = WEBHOOK_URL ? WEBHOOK_URL : configuration.client.connection.url;
    configuration.app.gateway.inboxQueue = GATEWAY_INBOX_QUEUE ? GATEWAY_INBOX_QUEUE : configuration.app.gateway.inboxQueue;
    configuration.app.gateway.outboxQueue = GATEWAY_OUTBOX_QUEUE ? GATEWAY_OUTBOX_QUEUE : configuration.app.gateway.outboxQueue;
    configuration.app.gateway.amqpURL = GATEWAY_AMQPURL ? GATEWAY_AMQPURL : configuration.app.gateway.amqpURL;
    configuration.app.privateKey = PRIVATE_KEY ? PRIVATE_KEY : configuration.app.privateKey;
    configuration.app.publicKey = PUBLIC_KEY ? PUBLIC_KEY : configuration.app.publicKey;
    configuration.app.subscriberId = SUBSCRIBER_ID ? SUBSCRIBER_ID : configuration.app.subscriberId;
    configuration.app.subscriberUri = SUBSCRIBER_URI ? SUBSCRIBER_URI : configuration.app.subscriberUri;
    configuration.app.registryUrl = REGISTRY_URL ? REGISTRY_URL : configuration.app.registryUrl;
    configuration.app.auth = AUTH ? AUTH === "true" : configuration.app.auth;
    configuration.app.uniqueKey = UNIQUE_KEY ? UNIQUE_KEY : configuration.app.uniqueKey;
    configuration.app.city = CITY ? CITY : configuration.app.city;
    configuration.app.country = COUNTRY ? COUNTRY : configuration.app.country;
    configuration.app.httpRetryCount = HTTP_RETRY_COUNT ? parseInt(HTTP_RETRY_COUNT) : configuration.app.httpRetryCount;
    return configuration;
};

export const getConfig = (): ConfigDataType => {
    if (configuration) {
        return configuration;
    }

    configuration = parseConfig(config);
    configuration = populateConfigFromEnv(configuration);
    if(!configuration){
        throw new Exception(ExceptionType.Config_NotFound, "Config file is not found.", 404);
    }

    return configuration!;
}