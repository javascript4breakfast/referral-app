import { describe, it, expect } from 'vitest';
import { makeReferralCode, makeInviteToken } from './ids';

describe('ID Generation', () => {
  describe('makeReferralCode', () => {
    it('should generate a 6-character uppercase code', () => {
      const code = makeReferralCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate unique codes', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(makeReferralCode());
      }
      // Should generate at least 95 unique codes out of 100
      expect(codes.size).toBeGreaterThan(95);
    });

    it('should only contain uppercase alphanumeric characters', () => {
      for (let i = 0; i < 20; i++) {
        const code = makeReferralCode();
        expect(code).toMatch(/^[A-Z0-9]+$/);
      }
    });
  });

  describe('makeInviteToken', () => {
    it('should generate a 32-character token', () => {
      const token = makeInviteToken();
      expect(token).toHaveLength(32);
    });

    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(makeInviteToken());
      }
      // All tokens should be unique
      expect(tokens.size).toBe(100);
    });

    it('should only contain alphanumeric characters', () => {
      for (let i = 0; i < 20; i++) {
        const token = makeInviteToken();
        expect(token).toMatch(/^[a-zA-Z0-9]+$/);
      }
    });
  });
});

