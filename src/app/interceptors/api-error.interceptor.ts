import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ToastService } from '../modules/toast/services/toast.service';
import { findFirstMessageLikeProp } from '../utils/error.utils';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        const defaultErrorMessage = 'Ocurrió un error inesperado';
        let message = findFirstMessageLikeProp(error.error);
        message = message || defaultErrorMessage;
        toastService.show(message, 'error');
      },
    })
  );
};
