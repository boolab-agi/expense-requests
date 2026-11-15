import { createServer } from "node:http";
import { approve, list, reject, submit } from "./requests.js";

const port = Number(process.env.PORT ?? 3000);

const json = (res, code, body) => {
  res.writeHead(code, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data ? JSON.parse(data) : {}));
  });

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && url.pathname === "/requests") return json(res, 200, list(url.searchParams.get("status")));
    if (req.method === "POST" && url.pathname === "/requests") return json(res, 201, submit(await readBody(req)));
    const m = url.pathname.match(/^\/requests\/(\d+)\/(approve|reject)$/);
    if (req.method === "POST" && m) {
      const { approver } = await readBody(req);
      return json(res, 200, (m[2] === "approve" ? approve : reject)(Number(m[1]), approver));
    }
    json(res, 404, { error: "not found" });
  } catch (e) {
    json(res, 400, { error: e.message });
  }
}).listen(port, () => console.log(`listening on ${port}`));
