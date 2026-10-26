import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { join, resolve, sep } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";

test("authentication lifecycle with an isolated database", { timeout: 60_000 }, async (t) => {
    const root = process.cwd();
    const directory = await mkdtemp(join(root, ".next", "auth-test-"));
    const databasePath = join(directory, "test.db");
    const database = new DatabaseSync(databasePath);
    try {
        const migrations = join(root, "prisma", "migrations");
        for (const entry of (await readdir(migrations, { withFileTypes: true })).filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
            database.exec(await readFile(join(migrations, entry.name, "migration.sql"), "utf8"));
        }
    } finally {
        database.close();
    }

    const probe = createServer().listen(0, "127.0.0.1");
    await once(probe, "listening");
    const port = probe.address().port;
    await new Promise((done) => probe.close(done));
    const baseURL = `http://127.0.0.1:${port}`;
    const server = spawn(process.execPath, [join(root, ".next", "standalone", "server.js")], {
        cwd: root,
        env: {
            ...process.env,
            NODE_ENV: "production",
            PORT: String(port),
            HOSTNAME: "127.0.0.1",
            DATABASE_URL: `file:${databasePath.replaceAll("\\", "/")}`,
            BETTER_AUTH_URL: baseURL,
            BETTER_AUTH_SECRET: "isolated-auth-test-secret-with-at-least-32-characters",
            DASHBOARD_ADMIN_EMAILS: "admin@example.test",
        },
        stdio: "ignore",
        windowsHide: true,
    });
    const exited = once(server, "exit");
    t.after(async () => {
        if (server.exitCode === null && server.signalCode === null) server.kill();
        await exited;
        assert.ok(resolve(directory).startsWith(join(root, ".next") + sep));
        await rm(directory, { recursive: true, force: true });
    });

    const cookies = new Map();
    const cookieHeader = () => [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
    const request = async (path, body, cookie = cookieHeader()) => {
        const response = await fetch(baseURL + path, {
            method: body ? "POST" : "GET",
            headers: { "content-type": "application/json", origin: "http://localhost:3000", cookie },
            body: body ? JSON.stringify(body) : undefined,
            redirect: "manual",
            signal: AbortSignal.timeout(10_000),
        });
        for (const header of response.headers.getSetCookie()) {
            const pair = header.split(";", 1)[0];
            const separator = pair.indexOf("=");
            const name = pair.slice(0, separator);
            const value = pair.slice(separator + 1);
            if (value) cookies.set(name, value);
            else cookies.delete(name);
        }
        return response;
    };

    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
        if (server.exitCode !== null || server.signalCode !== null) break;
        try {
            ready = (await request("/api/auth/get-session")).ok;
            if (ready) break;
        } catch {
            await delay(100);
        }
    }
    assert.ok(ready, "Production server must start after building the app");

    await t.test("anonymous visitors are redirected and APIs reject access", async () => {
        for (const path of ["/dashboard", "/dashboard/proyek", "/dashboard/pesan", "/dashboard/pengaturan"]) {
            const response = await request(path);
            assert.equal(response.status, 307, path);
            assert.equal(new URL(response.headers.get("location"), baseURL).pathname, "/auth");
        }
        assert.equal((await request("/api/dashboard/projects")).status, 401);
    });

    const credentials = { email: "admin@example.test", password: "AuthTest123!" };
    await t.test("invalid input is rejected and registration creates a session", async () => {
        assert.equal((await request("/api/auth/sign-in/email", { email: "invalid", password: "short" })).status, 400);
        const response = await request("/api/auth/sign-up/email", { ...credentials, name: "Test Admin" });
        assert.equal(response.status, 200);
        assert.equal((await response.json()).user.email, credentials.email);
        assert.ok(cookies.size > 0, "Registration should set a session cookie");
        assert.equal((await request("/api/auth/sign-out", {})).status, 200);
    });

    await t.test("wrong password is rejected and login restores dashboard access", async () => {
        assert.equal((await request("/api/auth/sign-in/email", { ...credentials, password: "WrongPassword123!" })).status, 401);
        assert.equal((await request("/api/auth/get-session")).status, 200);
        assert.equal(await (await request("/api/auth/get-session")).json(), null);
        const response = await request("/api/auth/sign-in/email", credentials);
        assert.equal(response.status, 200);
        assert.equal((await response.json()).user.email, credentials.email);
        const session = await (await request("/api/auth/get-session")).json();
        assert.equal(session.user.email, credentials.email);
        for (const path of ["/dashboard", "/dashboard/proyek", "/api/dashboard/projects", "/api/dashboard/messages", "/api/dashboard/settings"]) {
            assert.equal((await request(path)).status, 200, path);
        }
    });

    await t.test("logout revokes the session and regular accounts cannot use admin APIs", async () => {
        const previousCookie = cookieHeader();
        assert.equal((await request("/api/auth/sign-out", {})).status, 200);
        assert.equal((await request("/api/dashboard/projects", undefined, previousCookie)).status, 401);
        assert.equal(await (await request("/api/auth/get-session")).json(), null);
        assert.equal((await request("/api/auth/sign-up/email", { ...credentials, email: "member@example.test", name: "Test Member" })).status, 200);
        for (const path of ["/api/dashboard/projects", "/api/dashboard/messages", "/api/dashboard/settings"]) {
            assert.equal((await request(path)).status, 403, path);
        }
        assert.equal((await request("/api/auth/sign-out", {})).status, 200);
    });
});
