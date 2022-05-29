import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_CHAT_API);

export const SocketContext = createContext({});
