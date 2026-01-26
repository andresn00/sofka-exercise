const ERROR_MESSAGE_LIKE_KEYS = ['message', 'msg', 'detail', 'description', 'error', 'errorMessage'];
const ERROR_MESSAGE_LIKE_KEYS_LOWERCASE = ERROR_MESSAGE_LIKE_KEYS.map((key) => key.toLowerCase());

export const findFirstMessageLikeProp = (obj: unknown): string | null => {
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object' || obj === null) return null;

  for (const [key, value] of Object.entries(obj)) {
    if (ERROR_MESSAGE_LIKE_KEYS_LOWERCASE.includes(key.toLowerCase()) && typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object' && value !== null) {
      const found = findFirstMessageLikeProp(value);
      if (found) return found;
    }
  }

  return null;
};
