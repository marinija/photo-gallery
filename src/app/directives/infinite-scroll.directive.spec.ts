import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InfiniteScrollDirective } from './infinite-scroll.directive';

@Component({
  standalone: true,
  imports: [InfiniteScrollDirective],
  template: `<div infiniteScroll (infiniteScrolled)="onScrolled()"></div>`,
})
class TestHostComponent {
  onScrolled = vi.fn();
}

let intersectionCallback: IntersectionObserverCallback;
let observerInstance: MockIntersectionObserver;

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
    observerInstance = this;
  }
}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start observing the host element on init', () => {
    expect(observerInstance.observe).toHaveBeenCalledTimes(1);
  });

  it('should emit scrolled when entry is intersecting', () => {
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(host.onScrolled).toHaveBeenCalledTimes(1);
  });

  it('should not emit scrolled when entry is not intersecting', () => {
    intersectionCallback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(host.onScrolled).not.toHaveBeenCalled();
  });

  it('should disconnect observer on destroy', () => {
    fixture.destroy();
    expect(observerInstance.disconnect).toHaveBeenCalledTimes(1);
  });
});
