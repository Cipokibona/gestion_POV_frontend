import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAchat } from './list-achat';

describe('ListAchat', () => {
  let component: ListAchat;
  let fixture: ComponentFixture<ListAchat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAchat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAchat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
