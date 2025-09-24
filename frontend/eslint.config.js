"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var js_1 = require("@eslint/js");
var globals_1 = require("globals");
var typescript_eslint_1 = require("typescript-eslint");
var eslint_plugin_vue_1 = require("eslint-plugin-vue");
var eslint_plugin_1 = require("@stylistic/eslint-plugin");
exports.default = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '*.min.js',
            '*.bundle.js',
            '**/*.d.ts',
            'coverage/**',
            '**/vendor/**',
        ],
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        plugins: {
            js: js_1.default,
            '@stylistic': eslint_plugin_1.default,
        },
        languageOptions: {
            globals: __assign(__assign({}, globals_1.default.browser), globals_1.default.node),
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: __assign(__assign({}, js_1.default.configs.recommended.rules), { '@stylistic/indent': ['error', 2], '@stylistic/semi': ['error', 'always'] }),
    }
], typescript_eslint_1.default.configs.recommended, true), [
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-namespace': 'off',
        },
    }
], false), eslint_plugin_vue_1.default.configs['flat/recommended'], true), [
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: typescript_eslint_1.default.parser,
                extraFileExtensions: ['.vue'],
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            'vue/multi-word-component-names': 'warn',
            'vue/html-self-closing': 'off',
            'vue/component-api-style': ['error', ['script-setup']],
            'vue/max-attributes-per-line': 'off',
            'vue/singleline-html-element-content-newline': 'off',
        },
    },
], false);
