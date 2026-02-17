import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInfo } from './home-info';

describe('HomeCollage', () => {
    let component: HomeInfo;
    let fixture: ComponentFixture<HomeInfo>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeInfo],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeInfo);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
