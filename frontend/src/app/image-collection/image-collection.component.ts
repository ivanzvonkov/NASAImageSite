import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-collection',
  templateUrl: './image-collection.component.html',
  styleUrls: ['./image-collection.component.css']
})
export class ImageCollectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }
  
  onClick(){
    console.log("test");
  }

}
