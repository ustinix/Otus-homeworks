export const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
