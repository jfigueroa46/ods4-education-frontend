import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Global HTTP error interceptor.
 * Catches any HTTP error and logs it to the console.
 * Components should handle errors in their own subscribe() error callbacks.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
