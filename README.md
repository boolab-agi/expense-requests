# Expense requests

Internal tool for submitting and approving expense requests.

## API

- `POST /requests` with `{ requester, amount, category, note }` submits a request.
- `GET /requests?status=pending` lists requests.
- `POST /requests/:id/approve` or `/reject` with `{ approver }` decides one. Nobody approves their own request.

Run `npm test` for the tests.
