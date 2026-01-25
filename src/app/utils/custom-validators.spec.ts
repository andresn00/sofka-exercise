import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators.utils';

describe('CustomValidators', () => {
  describe('dateCompare', () => {
    const format = 'yyyy-MM-dd';
    const compareToDate = new Date(2024, 0, 15); // 2024-01-15

    describe('empty value', () => {
      it('should return null if control value is null', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '>');
        const control = new FormControl(null);

        expect(validator(control)).toBeNull();
      });

      it('should return null if control value is empty string', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '>');
        const control = new FormControl('');

        expect(validator(control)).toBeNull();
      });
    });

    describe('invalid date', () => {
      it('should return invalidDate error when date cannot be parsed', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '>');
        const control = new FormControl('not-a-date');

        expect(validator(control)).toEqual({ invalidDate: true });
      });
    });

    describe('comparison operators', () => {
      it('should validate ">" operator', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '>');
        const control = new FormControl('2024-01-16');

        expect(validator(control)).toBeNull();
      });

      it('should invalidate ">" operator when date is equal', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '>');
        const control = new FormControl('2024-01-15');

        expect(validator(control)).toEqual({
          dateCompare: { operator: '>', compareToDate },
        });
      });

      it('should validate ">=" operator when date is equal', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '>=');
        const control = new FormControl('2024-01-15');

        expect(validator(control)).toBeNull();
      });

      it('should validate "<" operator', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '<');
        const control = new FormControl('2024-01-14');

        expect(validator(control)).toBeNull();
      });

      it('should invalidate "<" operator when date is equal', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '<');
        const control = new FormControl('2024-01-15');

        expect(validator(control)).toEqual({
          dateCompare: { operator: '<', compareToDate },
        });
      });

      it('should validate "<=" operator when date is equal', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '<=');
        const control = new FormControl('2024-01-15');

        expect(validator(control)).toBeNull();
      });

      it('should validate "=" operator when date is equal', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '=');
        const control = new FormControl('2024-01-15');

        expect(validator(control)).toBeNull();
      });

      it('should invalidate "=" operator when date is different', () => {
        const validator = CustomValidators.dateCompare(compareToDate, format, '=');
        const control = new FormControl('2024-01-16');

        expect(validator(control)).toEqual({
          dateCompare: { operator: '=', compareToDate },
        });
      });
    });
  });
});
