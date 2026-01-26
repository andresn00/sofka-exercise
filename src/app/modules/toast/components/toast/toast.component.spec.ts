import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ToastData } from '../../types/toast.types';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let component: ToastComponent;
  let toastSubject: Subject<ToastData | null>;

  const toastServiceMock = {
    toast$: new Subject<ToastData | null>(),
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    toastSubject = toastServiceMock.toast$;

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        {
          provide: ToastService,
          useValue: toastServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toast message when emitted', () => {
    toastSubject.next({
      message: 'Hello world',
      type: 'error',
      delay: 2000,
    });
    fixture.detectChanges();

    const toastEl = fixture.debugElement.query(By.css('.toast'));
    expect(toastEl).toBeTruthy();
    expect(toastEl.nativeElement.textContent).toContain('Hello world');
  });

  it('should hide toast after default delay (3000ms)', () => {
    toastSubject.next({
      message: 'Auto hide',
      type: 'error',
      delay: 3000,
    });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.toast'))).toBeTruthy();

    jest.advanceTimersByTime(3000);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.toast'))).toBeNull();
  });

  it('should hide toast after custom delay', () => {
    toastSubject.next({
      message: 'Custom delay',
      delay: 1000,
      type: 'error',
    });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.toast'))).toBeTruthy();

    jest.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.toast'))).toBeNull();
  });

  it('should replace current toast when a new one arrives', () => {
    toastSubject.next({
      message: 'First',
      delay: 3000,
      type: 'error',
    });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.toast'))?.nativeElement.textContent).toContain('First');

    toastSubject.next({
      message: 'Second',
      delay: 3000,
      type: 'error',
    });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.toast'))?.nativeElement.textContent).toContain('Second');
  });
});
