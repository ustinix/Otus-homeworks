import { describe, it, expect } from 'vitest';
import { loginValidationSchema } from '../../src/utils/loginValidationSchema';

describe('loginValidationSchema', () => {
  describe('name validation', () => {
    it('should return true for valid name', () => {
      const result = loginValidationSchema.customerName('Ksu');
      expect(result).toBe(true);
    });
    it('should return error for short name', () => {
      const result = loginValidationSchema.customerName('K');
      expect(result).toBe('Имя должно содержать минимум две буквы');
    });
    it('should return error for empty name', () => {
      const result = loginValidationSchema.customerName('');
      expect(result).toBe('Имя должно содержать минимум две буквы');
    });
  });
  describe('email validation', () => {
    it('should return true for valid email', () => {
      const result = loginValidationSchema.email('ksu@example.com');
      expect(result).toBe(true);
    });
    it('should return true for valid email with subdomain', () => {
      const result = loginValidationSchema.email('ksu@sub.example.com');
      expect(result).toBe(true);
    });
    it('should return error message for email without @', () => {
      const result = loginValidationSchema.email('userexample.com');
      expect(result).toBe('Введите корректный email');
    });
    it('should return error message for email without domain', () => {
      const result = loginValidationSchema.email('user@');
      expect(result).toBe('Введите корректный email');
    });
    it('should return error message for empty email', () => {
      const result = loginValidationSchema.email('');
      expect(result).toBe('Введите корректный email');
    });
  });
  describe('password validation', () => {
    it('should return true for valid password', () => {
      const result = loginValidationSchema.password('Password123');
      expect(result).toBe(true);
    });

    it('should return true for valid password with special characters', () => {
      const result = loginValidationSchema.password('Password123!@#');
      expect(result).toBe(true);
    });

    it('should return error message for password without uppercase', () => {
      const result = loginValidationSchema.password('password123');
      expect(result).toBe(
        'Пароль должен содержать не менее 8 символов, как минимум 1 цифру и 1 букву в верхнем регистре',
      );
    });
    it('should return error message for short password', () => {
      const result = loginValidationSchema.password('Pass1');
      expect(result).toBe(
        'Пароль должен содержать не менее 8 символов, как минимум 1 цифру и 1 букву в верхнем регистре',
      );
    });
    it('should return error message for empty password', () => {
      const result = loginValidationSchema.password('');
      expect(result).toBe(
        'Пароль должен содержать не менее 8 символов, как минимум 1 цифру и 1 букву в верхнем регистре',
      );
    });
  });
});
