import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequests } from './list-requests';

describe('ListRequests', () => {
  let component: ListRequests;
  let fixture: ComponentFixture<ListRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
