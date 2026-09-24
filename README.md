# Gustavo

A CRM for our clients. Plain HTML/CSS/JS, no build step.

## Running it

Open [index.html](index.html) in a browser, or serve it locally:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then visit http://localhost:8080.

## Sign in

- Username: `admin`
- Password: `12345`

The login is a front-end prototype: users are defined in [auth.js](auth.js) and checked in the browser. It needs a real backend before clients use it.
