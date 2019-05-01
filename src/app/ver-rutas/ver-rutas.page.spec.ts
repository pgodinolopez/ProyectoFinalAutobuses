import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRutasPage } from './ver-rutas.page';

describe('VerRutasPage', () => {
  let component: VerRutasPage;
  let fixture: ComponentFixture<VerRutasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerRutasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerRutasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
