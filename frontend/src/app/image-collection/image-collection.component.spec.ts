import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCollectionComponent } from './image-collection.component';

describe('ImageCollectionComponent', () => {
  let component: ImageCollectionComponent;
  let fixture: ComponentFixture<ImageCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
