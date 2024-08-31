import express, {Request, Response} from "express";
import touch from './server/touch';
import {Server} from "socket.io";
import * as path from 'path';
import * as http from 'http';
import {ClientEvents, ServerEvents, SocketData} from "./types/server";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import StateManager from "./server/StateManager";

const app = express();
const server = http.createServer(app);
const io = new Server<ClientEvents, ServerEvents, DefaultEventsMap, SocketData>(server);
const manager = new StateManager();
const port = 3080;

console.log('Server started...');

touch( 'data');
touch( 'data/accounts');
touch( 'data/chars');
touch('data/tables');

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.json());

app.get(/\w*/, function (req: Request, res:Response) {
  res.sendFile(path.join(__dirname,'..', 'build', 'index.html'));
});

io.on("connection", socket => {
    console.log('  Client has connected.');
    manager.registerAuthenticationHandlers(socket);
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});