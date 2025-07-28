import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDistributeur } from './list-distributeur';

describe('ListDistributeur', () => {
  let component: ListDistributeur;
  let fixture: ComponentFixture<ListDistributeur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDistributeur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDistributeur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
