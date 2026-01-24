import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { format, isAfter, isBefore, isEqual, isValid, parse } from 'date-fns';

type DateComparisonOperator = '>' | '>=' | '<' | '<=' | '=';

export class CustomValidators {
  static dateCompare(compareToDate: Date, dateFormat: string, operator: DateComparisonOperator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;
      if (!value) return null;

      const date = parse(value, dateFormat, new Date());
      if (!date || !isValid(date)) return { invalidDate: true };

      const dateStr = format(date, dateFormat);
      const compareToDateStr = format(compareToDate, dateFormat);

      let valid = false;
      switch (operator) {
        case '>':
          valid = isAfter(dateStr, compareToDateStr);
          break;
        case '>=':
          valid = isAfter(dateStr, compareToDateStr) || isEqual(dateStr, compareToDateStr);
          break;
        case '<':
          valid = isBefore(dateStr, compareToDateStr);
          break;
        case '<=':
          valid = isBefore(dateStr, compareToDateStr) || isEqual(dateStr, compareToDateStr);
          break;
        case '=':
          valid = isEqual(dateStr, compareToDateStr);
          break;
        default:
          valid = isAfter(dateStr, compareToDateStr);
      }
      if (valid) return null;
      return { dateCompare: { operator, compareToDate } };
    };
  }
}
