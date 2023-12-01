import Utils from "./utils";

const connections = Utils.isLocal() ? {
    httpServer: 'http://localhost:3000',
    wsServer: 'ws://localhost:3000'
} : {
    httpServer: 'https://daniels-connect4-server.adaptable.app',
    wsServer: 'wss://daniels-connect4-server.adaptable.app'
};

const config = {
    version: '0.3.10b',
    connections,
};

export default config;