import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPov } from './list-pov';

describe('ListPov', () => {
  let component: ListPov;
  let fixture: ComponentFixture<ListPov>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPov]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPov);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
