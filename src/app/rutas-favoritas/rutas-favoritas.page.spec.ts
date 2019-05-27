import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasFavoritasPage } from './rutas-favoritas.page';

describe('RutasFavoritasPage', () => {
  let component: RutasFavoritasPage;
  let fixture: ComponentFixture<RutasFavoritasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutasFavoritasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RutasFavoritasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
