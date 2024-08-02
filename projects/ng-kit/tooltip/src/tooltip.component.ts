import {Component, Input} from '@angular/core';

@Component({
  selector: 'kit-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  host: {
    "[id]": "id",
    "attr.aria-role": "tooltip",
    "[class]": "tooltipClass"
  }
})
export class TooltipComponent {
  @Input()
  tooltipClass?: string;
  @Input() message?: string;
  private static tooltipCount = 0;
  public readonly id = `tooltip-${++TooltipComponent.tooltipCount}`;
}
