"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var config_1 = require("vitest/config");
var vite_config_1 = require("./vite.config");
exports.default = (0, config_1.mergeConfig)(vite_config_1.default, (0, config_1.defineConfig)({
    test: {
        environment: 'jsdom',
        exclude: __spreadArray(__spreadArray([], config_1.configDefaults.exclude, true), ['e2e/**'], false),
        root: (0, url_1.fileURLToPath)(new URL('./', import.meta.url)),
    },
}));
