import createDebugMessages from "debug";

const debug = createDebugMessages("backend:helpers:routes");

export const execute = async (action, params, req, res, next) => {
	try {
		const entity = await action(params);

		debug("%O", entity);

		if (entity.error) {
			res.formatter.ok({
				message: entity.error,
				success: false,
			});
		} else {
			switch (req.method) {
				case "POST":
					res.formatter.created(entity);
					break;

				default:
					res.formatter.ok(entity);
					break;
			}
		}
	} catch (error) {
		next(error);
	}
};
