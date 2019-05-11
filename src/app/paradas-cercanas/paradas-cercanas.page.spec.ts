import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParadasCercanasPage } from './paradas-cercanas.page';

describe('ParadasCercanasPage', () => {
  let component: ParadasCercanasPage;
  let fixture: ComponentFixture<ParadasCercanasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParadasCercanasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParadasCercanasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
