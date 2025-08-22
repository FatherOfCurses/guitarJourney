"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const app_shell_component_1 = require("./shells/app-shell.component");
describe('App Routes', () => {
    it('should export a non-empty routes array', () => {
        expect(Array.isArray(routes_1.routes)).toBe(true);
        expect(routes_1.routes.length).toBeGreaterThan(0);
    });
    it('should define the login route with a loadComponent function', () => {
        const login = routes_1.routes.find(r => r.path === 'login');
        expect(login).toBeTruthy();
        expect(typeof login.loadComponent).toBe('function');
    });
    it('should define the shell route at root with AppShellComponent and children', () => {
        const shell = routes_1.routes.find(r => r.path === '');
        expect(shell).toBeTruthy();
        expect(shell.component).toBe(app_shell_component_1.AppShellComponent);
        expect(Array.isArray(shell.children)).toBe(true);
        expect(shell.children.length).toBeGreaterThan(0);
    });
    describe('shell child routes', () => {
        const shell = routes_1.routes.find(r => r.path === '');
        const children = (shell.children ?? []);
        it('should include "" (home), "sessions", "songs", and "metrics"', () => {
            const paths = children.map(c => c.path);
            expect(paths).toEqual(['', 'sessions', 'songs', 'metrics']);
        });
        it('home child route should match full path and lazy-load', () => {
            const home = children.find(c => c.path === '');
            expect(home).toBeTruthy();
            expect(home.pathMatch).toBe('full');
            expect(typeof home.loadComponent).toBe('function');
        });
        it.each(['sessions', 'songs', 'metrics'])('child route "%s" should lazy-load a component', (p) => {
            const child = children.find(c => c.path === p);
            expect(child).toBeTruthy();
            expect(typeof child.loadComponent).toBe('function');
        });
    });
    it('should define a wildcard 404 route that lazy-loads', () => {
        const notFound = routes_1.routes.find(r => r.path === '**');
        expect(notFound).toBeTruthy();
        expect(typeof notFound.loadComponent).toBe('function');
    });
    it('should not contain duplicate top-level paths', () => {
        const paths = routes_1.routes.map(r => r.path);
        const unique = new Set(paths);
        expect(unique.size).toBe(paths.length);
    });
});
