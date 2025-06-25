import { Component, inject, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HomeNavbar } from '../../shared/home-navbar/home-navbar';
import { HomeFooter } from '../../shared/home-footer/home-footer';
import { HomeRating } from './components/home-rating/home-rating';
import { HomeCollage } from './components/home-collage/home-collage';

@Component({
  selector: 'app-home',
  imports: [HomeNavbar, HomeFooter, HomeRating, HomeCollage],
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
