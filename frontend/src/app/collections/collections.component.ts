import { Component, OnInit } from '@angular/core';
import { CollectionsService } from '../collections.service';
import { SignInService } from '../sign-in.service';

declare var $: any;

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  collectionResponse = [];
  numbers = [];
  defaultPrivacy = {"value": "private"};
  
  constructor(private _collectionsService: CollectionsService, private _s: SignInService) { }

  ngOnInit() {
    this.numbers = [0,1,2,3,4,5];
    this._collectionsService.setToken(this._s.token);
    this._collectionsService.getCollections(this.onResponse.bind(this));
  }
  
  //gets response
  onResponse(res) {
    
    this.collectionResponse = res;
    
    this.collectionResponse.sort(function(a, b) { 
        if(a.rating == undefined)
          return 1;
        if(b.rating == undefined)
          return -1;
          
        return b.rating - a.rating;
    });
    
    //max 10
    if(this.collectionResponse.length > 10)
      this.collectionResponse = this.collectionResponse.slice(10);
    
  }
  
  //add new collection
  submitForm(form) {
     this._collectionsService.createCollection(
       form.value["collection-title"], 
       form.value["collection-description"], 
       form.value["privacy-radio"],
       this._s.getToken(),
       this.onResponse.bind(this) );
     form.reset();
     $('#create-collection-modal').modal("hide");
  }
  
  //edit current collection
  submitEditForm(form, collection_id){
    console.log('ok '+collection_id);
    this._collectionsService.editCollection(collection_id, form.value["collection-title"], form.value["collection-description"], form.value["privacy-radio"]/*, this.onResponse.bind(this)*/ );
     $('#edit-modal'+collection_id).modal("hide");
  }
  
  //deletes entire collection
  deleteCollection(collection_id){
    alert("Delete Collection?");
    this._collectionsService.deleteCollection(collection_id, this.onResponse.bind(this) );
  }
  
  //deletes single image
  deleteImage(collection_id, image_json, i){
    var nasa_id = image_json.split('asset/').pop();
    
    //console.log('trying to hide image: '+"#"+collection_id+"image"+i);
    $("#"+collection_id+"image"+i).hide();
    
    this._collectionsService.deleteImage(collection_id, nasa_id);
   
  }
  
  rateCollection(rating, collection_id){
    this._collectionsService.rateCollection(collection_id, rating, this.onResponse.bind(this) );
    $('#modal'+collection_id).modal("hide");
  }

}
