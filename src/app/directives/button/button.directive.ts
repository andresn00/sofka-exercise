import { computed, Directive, input } from '@angular/core';

type ButtonColor = 'primary' | 'secondary' | 'danger';

@Directive({
  selector: '[appButton]',
  host: {
    class: 'btn',
    '[class]': 'btnColorClass()',
  },
})
export class ButtonDirective {
  color = input<ButtonColor>('primary');

  btnColorClass = computed(() => `btn-color-${this.color()}`);
}
