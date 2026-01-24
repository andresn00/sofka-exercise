import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isAfter, isBefore, isEqual, isValid, parse } from 'date-fns';

type DateComparisonOperator = '>' | '>=' | '<' | '<=' | '=';

export class CustomValidators {
  static dateCompare(compareToDate: Date, dateFormat: string, operator: DateComparisonOperator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;
      if (!value) return null;

      const date = parse(value, dateFormat, new Date());
      if (!date || !isValid(date)) return { invalidDate: true };

      let valid = false;
      switch (operator) {
        case '>':
          valid = isAfter(date, compareToDate);
          break;
        case '>=':
          valid = isAfter(date, compareToDate) || isEqual(date, compareToDate);
          break;
        case '<':
          valid = isBefore(date, compareToDate);
          break;
        case '<=':
          valid = isBefore(date, compareToDate) || isEqual(date, compareToDate);
          break;
        case '=':
          valid = isEqual(date, compareToDate);
          break;
        default:
          valid = isAfter(date, compareToDate);
      }
      if (valid) return null;
      return { dateCompare: { operator, compareToDate: compareToDate } };
    };
  }
}
