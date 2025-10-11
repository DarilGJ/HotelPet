import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickRoomComponent } from './pick-room.component';

describe('PickRoomComponent', () => {
  let component: PickRoomComponent;
  let fixture: ComponentFixture<PickRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickRoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
