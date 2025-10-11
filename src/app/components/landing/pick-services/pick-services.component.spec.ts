import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickServicesComponent } from './pick-services.component';

describe('PickServicesComponent', () => {
  let component: PickServicesComponent;
  let fixture: ComponentFixture<PickServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
