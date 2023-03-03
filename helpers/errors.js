export class NotFoundError extends Error {
	constructor(...params) {
		super(...params);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, NotFoundError);
		}

		this.name = "NotFoundError";
		this.code = "NOT_FOUND";
		this.date = new Date();
	}
}
