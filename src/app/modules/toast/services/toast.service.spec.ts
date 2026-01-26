import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show add toast to subject', (done) => {
    service.toast$.subscribe((toast) => {
      expect(toast).toEqual({ message: 'Hello', type: 'success', delay: 3000 });
      done();
    });
    service.show('Hello', 'success');
  });
});
