"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cypress_1 = require("cypress");
exports.default = (0, cypress_1.defineConfig)({
    e2e: {
        specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
        baseUrl: 'http://localhost:5173/',
    },
    component: {
        devServer: {
            framework: 'vue',
            bundler: 'vite',
        },
        specPattern: 'cypress/component/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    },
});
