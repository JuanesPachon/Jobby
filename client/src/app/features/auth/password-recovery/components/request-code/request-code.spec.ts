import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCode } from './request-code';

describe('RequestCode', () => {
    let component: RequestCode;
    let fixture: ComponentFixture<RequestCode>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RequestCode],
        }).compileComponents();

        fixture = TestBed.createComponent(RequestCode);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
