import http from "node:http";

const PORT = 9091;

// State store
let lastClientConnected = null;
let clientLogs = [];
let pendingEval = null;
let evalResults = [];

const server = http.createServer((req, res) => {
	// Enable CORS for Chrome DevTools / localhost
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	const url = new URL(req.url, `http://localhost:${PORT}`);

	if (req.method === "POST" && url.pathname === "/push-log") {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			try {
				const payload = JSON.parse(body);
				lastClientConnected = new Date().toISOString();
				clientLogs.push({
					timestamp: lastClientConnected,
					type: payload.type || "info",
					message: payload.message,
					url: payload.url,
					details: payload.details,
				});
				if (clientLogs.length > 200) clientLogs.shift();

				console.log(`[DEVTOOLS BRIDGE] [${payload.type || "LOG"}] ${payload.message}`);
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ ok: true }));
			} catch (err) {
				res.writeHead(400, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ error: err.message }));
			}
		});
		return;
	}

	if (req.method === "GET" && url.pathname === "/poll-eval") {
		res.writeHead(200, { "Content-Type": "application/json" });
		const command = pendingEval;
		pendingEval = null;
		res.end(JSON.stringify({ command }));
		return;
	}

	if (req.method === "POST" && url.pathname === "/eval-result") {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			try {
				const result = JSON.parse(body);
				evalResults.push({ timestamp: new Date().toISOString(), result });
				console.log(`[DEVTOOLS BRIDGE] Eval Result:`, result);
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ ok: true }));
			} catch (err) {
				res.writeHead(400);
				res.end(JSON.stringify({ error: err.message }));
			}
		});
		return;
	}

	if (req.method === "POST" && url.pathname === "/queue-eval") {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			try {
				const { command } = JSON.parse(body);
				pendingEval = command;
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ ok: true, queued: command }));
			} catch (err) {
				res.writeHead(400);
				res.end(JSON.stringify({ error: err.message }));
			}
		});
		return;
	}

	if (req.method === "GET" && url.pathname === "/status") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				port: PORT,
				lastClientConnected,
				logsCount: clientLogs.length,
				recentLogs: clientLogs.slice(-20),
				latestEvalResult: evalResults.slice(-1)[0] || null,
			}),
		);
		return;
	}

	res.writeHead(404);
	res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
	console.log(`[CHROME DEVTOOLS BRIDGE] Server listening on http://localhost:${PORT}`);
});
