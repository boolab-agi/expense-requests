import { test } from "node:test";
import assert from "node:assert/strict";
import { approve, list, reject, submit } from "../src/requests.js";

test("submit creates a pending request", () => {
  const r = submit({ requester: "a@example.com", amount: 42.5, category: "travel" });
  assert.equal(r.status, "pending");
  assert.ok(list("pending").some((x) => x.id === r.id));
});

test("an approver can approve or reject", () => {
  const a = submit({ requester: "a@example.com", amount: 10, category: "meals" });
  const b = submit({ requester: "a@example.com", amount: 99, category: "software" });
  assert.equal(approve(a.id, "b@example.com").status, "approved");
  assert.equal(reject(b.id, "b@example.com").status, "rejected");
});

test("nobody approves their own request", () => {
  const r = submit({ requester: "a@example.com", amount: 5, category: "meals" });
  assert.throws(() => approve(r.id, "a@example.com"), /own request/);
});

test("amounts must be positive", () => {
  assert.throws(() => submit({ requester: "a@example.com", amount: 0, category: "meals" }), /positive/);
});
