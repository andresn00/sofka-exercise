import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastData, ToastType } from '../types/toast.types';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toast$ = new Subject<ToastData>();
  readonly toast$ = this._toast$.asObservable();

  show(message: string, type: ToastType, delay = 3000) {
    this._toast$.next({ message, type, delay });
  }
}
