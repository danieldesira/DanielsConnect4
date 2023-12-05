import Utils from "./utils";
import {version} from "../../package.json";

const connections = Utils.isLocal()
  ? {
      httpServer: "http://localhost:3000",
      wsServer: "ws://localhost:3000",
    }
  : {
      httpServer: "https://daniels-connect4-server.adaptable.app",
      wsServer: "wss://daniels-connect4-server.adaptable.app",
    };

const config = {
  version,
  connections,
};

export default config;
