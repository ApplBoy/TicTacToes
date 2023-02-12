import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  template: `
    <button class="button-6">{{ value }}</button>
  `,
  styles: ['button {width: 100%;height: 100%;}'
  ]
})
export class SquareComponent {
  @Input()
  value: 'X' | 'O' | undefined;
}
