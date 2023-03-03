export const sessionViews = async (ctx, next) => {
	await next();
	// ignore favicon
	if (ctx.path === "/favicon.ico") return;

	let n = ctx.session.views || 0;
	ctx.session.views = ++n;
	console.log("n :>> ", n + " views");
	console.log("ctx.session :>> ", ctx.session);
};
