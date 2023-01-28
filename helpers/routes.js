import createDebugMessages from "debug";

const debug = createDebugMessages("backend:helper:routes");

export const execute = async (action, req, res) => {
	try {
		const entity = await action(req.body, req.params);
		if (entity.error) {
			res.formatter.ok({
				message: entity.error,
				success: false,
			});
		}

		switch (req.method) {
			case "POST":
				res.formatter.created(entity);

				break;

			default:
				res.formatter.ok(entity);
				break;
		}
	} catch (error) {
		res.formatter.serverError({ message: error, success: false });
	}
};
