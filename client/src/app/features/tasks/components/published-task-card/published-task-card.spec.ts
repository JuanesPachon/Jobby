import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedTaskCard } from './published-task-card';

describe('PublishedTaskCard', () => {
    let component: PublishedTaskCard;
    let fixture: ComponentFixture<PublishedTaskCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PublishedTaskCard],
        }).compileComponents();

        fixture = TestBed.createComponent(PublishedTaskCard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
