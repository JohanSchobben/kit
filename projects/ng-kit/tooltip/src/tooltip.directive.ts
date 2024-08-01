import {Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {Overlay, OverlayRef, ScrollDispatcher} from "@angular/cdk/overlay";
import {Subject, takeUntil} from "rxjs";
import {hasModifierKey} from "@angular/cdk/keycodes";
import {TooltipComponent} from "./tooltip.component";
import {ComponentPortal} from "@angular/cdk/portal";
import {debug} from "ng-packagr/lib/utils/log";

@Directive({
  selector: '[kitTooltip]',
  host: {
    "(mouseenter)": "onMouseenter()",
    "(mouseleave)": "onMouseleave()",
    "[attr.aria-describedby]": "tooltipId"
  }
})
export class TooltipDirective implements OnDestroy {
  private overlayRef?: OverlayRef;
  private destroy: Subject<void> = new Subject<void>();
  protected tooltip?: TooltipComponent;
  private _message?: string;
  private portal?: ComponentPortal<TooltipComponent>;

  @Input("kitTooltip")
  set message(message: string) {
    this._message = message;
    if (this.tooltip) {
      this.tooltip.message = message;
    }
  }


  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private scrollDispatcher: ScrollDispatcher
  ) {
  }

  public get tooltipId(): string {
    return this.tooltip?.id ?? '';
  }

  private createOverlay(): OverlayRef {
    const scrollableContainer = this.scrollDispatcher.getAncestorScrollContainers(this.el);
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.el.nativeElement)
      .withFlexibleDimensions(false)
      .withPositions([
        {
          originY: "top",
          originX: "center",
          overlayY: "bottom",
          overlayX: "center"
        },
        {
          originY: "bottom",
          originX: "center",
          overlayY: "top",
          overlayX: "center"
        }
      ])
      .withViewportMargin(0)
      .withScrollableContainers(scrollableContainer);

    strategy.positionChanges.subscribe((changes) => {
      if (this.overlayRef) {
        this.overlayRef.addPanelClass("kit-tooltip-position-above");
      }
    });

    this.overlayRef = this.overlay.create({
      direction: "ltr",
      positionStrategy: strategy,
      panelClass: "kit-tooltip",
      scrollStrategy: this.overlay.scrollStrategies.reposition({scrollThrottle: 20})
    });


    this.overlayRef.detachments().pipe(takeUntil(this.destroy)).subscribe(() => {
      if (this.overlayRef?.hasAttached()) {
        this.overlayRef?.detach()
      }
    });

    this.overlayRef.outsidePointerEvents().pipe(takeUntil(this.destroy)).subscribe((value) => {
      if (this.overlayRef?.hasAttached()) {
        this.hide();
      }
    });

    this.overlayRef.keydownEvents().pipe(takeUntil(this.destroy)).subscribe((event) => {
      if (event.key === "Escape" && !hasModifierKey(event)) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
      }
    });

    return this.overlayRef;

  }

private createPortal(): ComponentPortal<TooltipComponent> {
    this.portal = new ComponentPortal<TooltipComponent>(TooltipComponent);
    return this.portal;
}

private hide() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef?.detach();
    }
}

  private show(): void {
    const overlay = this.createOverlay();
    const portal = this.portal ?? this.createPortal();
    const component = overlay.attach(portal);
    component.instance.message = this._message;
    setTimeout(() => {debugger}, 1000)
  }

  protected onMouseenter(): void {
    setTimeout(() => this.show())
  }

  protected onMouseleave() {
    this.hide();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
