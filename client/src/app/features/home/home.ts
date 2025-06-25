import { Component, inject, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {

  private breakpoint = inject(BreakpointObserver);

  readonly isMobile = signal(true);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.breakpoint
      .observe('(min-width: 1024px)')
      .pipe(
        map(state => !state.matches),
        takeUntil(this.destroy$)
      )
      .subscribe(isMobile => this.isMobile.set(isMobile));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
