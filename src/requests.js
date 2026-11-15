// Expense requests: submit, list, approve or reject. In-memory store; one approver decides each request.
const requests = new Map();
let nextId = 1;

export function submit({ requester, amount, category, note = "" }) {
  if (!requester) throw new Error("requester is required");
  if (!(amount > 0)) throw new Error("amount must be positive");
  if (!category) throw new Error("category is required");
  const r = { id: nextId++, requester, amount: Math.round(amount * 100) / 100, category, note, status: "pending", decidedBy: null };
  requests.set(r.id, r);
  return r;
}

export function list(status) {
  const all = [...requests.values()];
  return status ? all.filter((r) => r.status === status) : all;
}

function decide(id, approver, status) {
  const r = requests.get(id);
  if (!r) throw new Error(`no request ${id}`);
  if (r.status !== "pending") throw new Error(`request ${id} is already ${r.status}`);
  if (approver === r.requester) throw new Error("you cannot approve your own request");
  r.status = status;
  r.decidedBy = approver;
  return r;
}

export const approve = (id, approver) => decide(id, approver, "approved");
export const reject = (id, approver) => decide(id, approver, "rejected");
