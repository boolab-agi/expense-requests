import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 3000);

createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  res.end("Expense requests\n");
}).listen(port, () => console.log(`listening on ${port}`));
