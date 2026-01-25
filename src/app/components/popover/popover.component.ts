import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-popover',
  imports: [],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  private renderer = inject(Renderer2);

  readonly MARGIN_X = 8;
  readonly GAP_Y = 8;

  isOpen = signal(false);

  trigger = signal<HTMLElement | null>(null);
  popoverBox = viewChild<ElementRef<HTMLDivElement>>('popoverBox');

  boxProps = computed(() => {
    const popoverBox = this.popoverBox();
    const trigger = this.trigger();
    if (!popoverBox || !trigger) return { left: 0, top: 0, opacity: 0 };

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popoverBox.nativeElement.getBoundingClientRect();

    let left = triggerRect.left + window.scrollX;
    const top = triggerRect.bottom + this.GAP_Y;
    const maxLeft = window.scrollX + window.innerWidth - popoverRect.width - this.MARGIN_X;

    left = Math.max(window.scrollX + this.MARGIN_X, Math.min(left, maxLeft));

    return { left, top, opacity: 1 };
  });

  public open(pointerEvent: PointerEvent | MouseEvent): void {
    const anchorEl = pointerEvent.currentTarget;
    if (!(anchorEl instanceof HTMLElement)) return;

    this.trigger.set(anchorEl);
    this.isOpen.set(true);
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  public close(): void {
    this.isOpen.set(false);
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }
}
