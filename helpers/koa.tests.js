// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";
import Stream from "stream";
import Koa from "koa";
import { expect } from "chai";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { dbCloseTest, dbConnectTest, dbWipe } from "./db.js";
import { app, server } from "../koa.js";
import { API_VERSION } from "./constants.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////

export const agent = request.agent(app.callback());

export const dbSetupWipeDBBeforeEach = (login = true) => {
	let mongoServer;
	before(async () => {
		mongoServer = await dbConnectTest();
		if (login) {
			// create a test user
			const username = "testPlayerForAuthentication";
			const password = "testtesttest";
			const player = await addEntity(`/${API_VERSION}/players`, {
				username,
				password,
			});
			console.log("player :>> ", player);
			// login
			const login = await agent.post(`/${API_VERSION}/auth/login`).send({
				username,
				password,
			});
			console.log("login :>> ", login.body);
		}
	});

	beforeEach(async () => {
		await dbWipe();
	});

	after(async () => {
		if (login) {
			const logout = await agent.post(`/${API_VERSION}/auth/logout`);
		}
		await dbCloseTest(mongoServer);
		server.close();
	});
};

export const closeServer = () => {
	after(async () => {
		server.close();
	});
};

export const expectSuccess = (res, status, data) => {
	expect(res.statusCode).to.equal(status);
	expect(res.body.success).to.equal(true);
	if (data) expect(res.body.entity).to.include(data);
};

export const expect404 = (res) => {
	expect(res.statusCode).to.equal(404);
	expect(res.body.success).to.equal(false);
	expect(res.body.message).to.equal("Not Found");
};

export const expect500 = (res) => {
	expect(res.statusCode).to.equal(500);
};

export const expectSuccessMultiple = (res, status, data) => {
	expect(res.statusCode).to.equal(status);
	expect(res.body.success).to.equal(true);
	expect(res.body.entities).to.be.an("array");

	if (data) {
		for (const key of Object.keys(data)) {
			expect(
				res.body.entities.some((entity) =>
					entity[key].to.include(data[key])
				)
			).to.be.true;
		}
	}
};

export const expectError = (res, status, validationMessage = "") => {
	expect(res.statusCode).to.equal(status);
	expect(res.body.success).to.equal(false);
	expect(res.body).to.haveOwnProperty("error");

	if (validationMessage)
		expect(res.body.message.includes(validationMessage)).to.be.true;
};

export const expectPatchUpdate = (res, data) => {
	expect(res.statusCode).to.equal(200);
	expect(res.body.success).to.equal(true);

	for (const key of Object.keys(data)) {
		// using "eql" instead of "equal" as that uses deep
		// comparison and works for arrays and objects
		expect(res.body.entity[key]).to.be.eql(data[key]);
	}
};

export const addEntity = async (path, data) => {
	try {
		const res = await agent.post(path).send(data);

		if (res.body.error) throw res.body.error;

		return res.body.entity._id;
	} catch (error) {
		return { error };
	}
};

// mock context
// from here: https://gist.github.com/emmanuelnk/f1254eed8f947a81e8d715476d9cc92c
export const context = (req = null, res = null, app = null) => {
	const socket = new Stream.Duplex();

	req = Object.assign(
		{ headers: {}, socket },
		Stream.Readable.prototype,
		req || {}
	);
	res = Object.assign(
		{ _headers: {}, socket },
		Stream.Writable.prototype,
		res || {}
	);
	req.socket.remoteAddress = req.socket.remoteAddress || "127.0.0.1";
	app = app || new Koa();
	res.getHeader = (k) => res._headers[k.toLowerCase()];
	res.setHeader = (k, v) => (res._headers[k.toLowerCase()] = v);
	res.removeHeader = (k, v) => delete res._headers[k.toLowerCase()];

	return app.createContext(req, res);
};
