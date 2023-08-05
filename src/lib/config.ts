import Utils from "./utils";

const config = Utils.isLocal() ? {
    httpServer: 'http://localhost:3000',
    wsServer: 'ws://localhost:3000'
} : {
    httpServer: 'https://daniels-connect4-server.adaptable.app',
    wsServer: 'wss://daniels-connect4-server.adaptable.app'
};

export default config;