import { Directive, ElementRef, inject, input, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnDestroy {
  threshold = input<number>(0.1, { alias: 'infiniteScrollThreshold' });
  scrolled = output({ alias: 'infiniteScrolled' });

  private el = inject(ElementRef<HTMLElement>);
  private observer!: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.scrolled.emit();
        }
      },
      { threshold: this.threshold() },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
