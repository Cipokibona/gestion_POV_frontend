import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPov } from './detail-pov';

describe('DetailPov', () => {
  let component: DetailPov;
  let fixture: ComponentFixture<DetailPov>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPov]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPov);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
