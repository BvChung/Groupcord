import { createContext } from "react";
import { io } from "socket.io-client";
export const socket = io.connect("http://localhost:3001/");

export const SocketContext = createContext({});
