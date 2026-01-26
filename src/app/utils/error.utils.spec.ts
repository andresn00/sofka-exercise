import { findFirstMessageLikeProp } from './error.utils';

describe('findFirstMessageLikeProp', () => {
  it('should return null for non-object inputs', () => {
    expect(findFirstMessageLikeProp(null)).toBeNull();
    expect(findFirstMessageLikeProp(undefined)).toBeNull();
    expect(findFirstMessageLikeProp(123)).toBeNull();
    expect(findFirstMessageLikeProp(true)).toBeNull();
  });

  it('should return message when found at root level', () => {
    expect(findFirstMessageLikeProp({ message: 'Root level error' })).toBe('Root level error');
    expect(findFirstMessageLikeProp({ error: 'Something went wrong' })).toBe('Something went wrong');
  });

  it('should return the first matching key even if others exist later', () => {
    const obj = {
      detail: 'First match',
      error: 'Should not reach here',
    };
    expect(findFirstMessageLikeProp(obj)).toBe('First match');
  });

  describe('for nested objects', () => {
    const testCases = [
      {
        obj: {
          meta: {
            info: {
              errorMessage: 'Nested error message',
            },
          },
        },
        expected: 'Nested error message',
      },
      {
        obj: {
          details: [
            {
              message: 'Formato de celular inválido',
            },
            {
              message: 'Formato de email inválido',
            },
          ],
        },
        expected: 'Formato de celular inválido',
      },
      {
        obj: {
          status: 'error',
          code: 500,
          error: {
            message: {
              message: 'Valores desactualizados. Por favor, vuelva a ingresar a la App',
            },
          },
          data: {
            refreshUserServices: true,
          },
        },
        expected: 'Valores desactualizados. Por favor, vuelva a ingresar a la App',
      },
      {
        obj: {
          status: 'error',
          code: 500,
          error: {
            message: {
              message: 'Servicio Web se encuentra bloqueado.',
            },
          },
        },
        expected: 'Servicio Web se encuentra bloqueado.',
      },
    ];
    testCases.forEach(({ obj, expected }) => {
      it(`should return message from nested objects`, () => {
        expect(findFirstMessageLikeProp(obj)).toBe(expected);
      });
    });
  });

  it('should ignore non-string values', () => {
    const obj = {
      msg: 404,
      message: ['array', 'of', 'messages'],
    };
    expect(findFirstMessageLikeProp(obj)).toBeNull();
  });

  it('should return null if no matching key exists', () => {
    const obj = {
      status: 'ok',
      code: 200,
      data: {
        title: 'No message here',
      },
    };
    expect(findFirstMessageLikeProp(obj)).toBeNull();
  });
});
