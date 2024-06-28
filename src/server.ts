import express, { Express, Request, Response } from "express";
import touch from './server/touch';
import { Server } from "socket.io";
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

console.log('Server started...');

touch('accounts');
touch('chars');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());




app.get(/\w*/, function (req: Request, res:Response) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// io.on("connection", socket => {
//     console.log('  Client has connected.');
//
// });


server.listen(3080, () => {
    console.log('listening on *:3080');
});