import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPov } from './form-pov';

describe('FormPov', () => {
  let component: FormPov;
  let fixture: ComponentFixture<FormPov>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPov]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPov);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
