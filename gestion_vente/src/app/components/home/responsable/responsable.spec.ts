import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Responsable } from './responsable';

describe('Responsable', () => {
  let component: Responsable;
  let fixture: ComponentFixture<Responsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Responsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Responsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
