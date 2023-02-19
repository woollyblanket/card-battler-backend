#!/usr/bin/env node

// EXTERNAL IMPORTS		///////////////////////////////////////////
import createDebugMessages from "debug";
import http from "http";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { app } from "../app.mjs";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:server");

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) return val;
	if (port >= 0) return port;

	return false;
};

const onError = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}

	const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const onListening = () => {
	const addr = server.address();
	const bind =
		typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
	debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "5050");

app.set("port", port);
// deepcode ignore HttpToHttps: deploying via railway.app which sets up certs and SSL for us
const server = http.createServer(app);

// PUBLIC 				///////////////////////////////////////////

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
