import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaniers } from './list-paniers';

describe('ListPaniers', () => {
  let component: ListPaniers;
  let fixture: ComponentFixture<ListPaniers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPaniers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPaniers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
