"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var loginValidationSchema_1 = require("../../src/utils/loginValidationSchema");
(0, vitest_1.describe)('loginValidationSchema', function () {
    (0, vitest_1.describe)('name validation', function () {
        (0, vitest_1.it)('should return true for valid name', function () {
            var result = loginValidationSchema_1.loginValidationSchema.customerName('Ksu');
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should return error for short name', function () {
            var result = loginValidationSchema_1.loginValidationSchema.customerName('K');
            (0, vitest_1.expect)(result).toBe('Имя должно содержать минимум две буквы');
        });
        (0, vitest_1.it)('should return error for empty name', function () {
            var result = loginValidationSchema_1.loginValidationSchema.customerName('');
            (0, vitest_1.expect)(result).toBe('Имя должно содержать минимум две буквы');
        });
    });
    (0, vitest_1.describe)('email validation', function () {
        (0, vitest_1.it)('should return true for valid email', function () {
            var result = loginValidationSchema_1.loginValidationSchema.email('ksu@example.com');
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should return true for valid email with subdomain', function () {
            var result = loginValidationSchema_1.loginValidationSchema.email('ksu@sub.example.com');
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should return error message for email without @', function () {
            var result = loginValidationSchema_1.loginValidationSchema.email('userexample.com');
            (0, vitest_1.expect)(result).toBe('Введите корректный email');
        });
        (0, vitest_1.it)('should return error message for email without domain', function () {
            var result = loginValidationSchema_1.loginValidationSchema.email('user@');
            (0, vitest_1.expect)(result).toBe('Введите корректный email');
        });
        (0, vitest_1.it)('should return error message for empty email', function () {
            var result = loginValidationSchema_1.loginValidationSchema.email('');
            (0, vitest_1.expect)(result).toBe('Введите корректный email');
        });
    });
    (0, vitest_1.describe)('password validation', function () {
        (0, vitest_1.it)('should return true for valid password', function () {
            var result = loginValidationSchema_1.loginValidationSchema.password('Password123');
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should return true for valid password with special characters', function () {
            var result = loginValidationSchema_1.loginValidationSchema.password('Password123!@#');
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should return error message for password without uppercase', function () {
            var result = loginValidationSchema_1.loginValidationSchema.password('password123');
            (0, vitest_1.expect)(result).toBe('Пароль должен содержать не менее 8 символов, как минимум 1 цифру и 1 букву в верхнем регистре');
        });
        (0, vitest_1.it)('should return error message for short password', function () {
            var result = loginValidationSchema_1.loginValidationSchema.password('Pass1');
            (0, vitest_1.expect)(result).toBe('Пароль должен содержать не менее 8 символов, как минимум 1 цифру и 1 букву в верхнем регистре');
        });
        (0, vitest_1.it)('should return error message for empty password', function () {
            var result = loginValidationSchema_1.loginValidationSchema.password('');
            (0, vitest_1.expect)(result).toBe('Пароль должен содержать не менее 8 символов, как минимум 1 цифру и 1 букву в верхнем регистре');
        });
    });
});
