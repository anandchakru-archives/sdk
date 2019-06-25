import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NiviteWrapComponent } from './nivite-wrap.component';

describe('NiviteWrapComponent', () => {
  let component: NiviteWrapComponent;
  let fixture: ComponentFixture<NiviteWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NiviteWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiviteWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
