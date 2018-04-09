import { Component, OnInit } from '@angular/core';
import { ImagesService } from '../images.service';
import { CollectionsService } from '../collections.service';
import { SignInService } from '../sign-in.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  searchValue:string = "";
  
  values =" ";
  noImages = false;
  loading = false;
  
  nextPageAvailable = false;
  previousPageAvailable = false;
  
  response = ''; //holds all images in response
  currentImagesOnPage = ''; //holds all images on current page
  
  amountOfPagesOnScreen = 9;
  indexOfFirstImage = 0;
  
  collections = []; //collections where to save
  selectedCollection = ''; //collection to be saved to
  
  email = '';
  
  constructor(private _imagesService: ImagesService, private _collectionsService: CollectionsService, private _s: SignInService) { }

  ngOnInit() {
    this._s.getEmail(this.onEmailResponse.bind(this));
    this._collectionsService.getCollections(this.onCollectionResponse.bind(this));
    
  }
  
  //gets user email
  onEmailResponse(res){
    this.email = res.email;
    console.log(this.email);
  }
  
  //gets collection response
  onCollectionResponse(res ) {
    
    //only puts collections which user owns
    for(var i = 0; i < res.length; i++){
      if(res[i].owner == this.email){
        this.collections.push(res[i]);
      }
    }
  }
  
  //records values in search bar, searches on enter
  onSearchKey(event: any){
    this.noImages = false;
    if(event.keyCode == 13){
      this.search();
    }
    this.values = event.target.value;
  }
  
  //call on response to get data
  search(){
    this.loading = true;
    this._imagesService.getData(this.onResponse.bind(this), this.values);
  }

  //saves response from api with all images
  onResponse(res: string) {
    this.loading = false;
    this.response = res;
    if(this.response.length == 0)
      this.noImages = true;
    else{
      //console.log(res);
      this.indexOfFirstImage = 0;
      this.updatePage();
    }  
  }
  
  //go to next page
  nextPage(){
    this.indexOfFirstImage = this.indexOfFirstImage + this.amountOfPagesOnScreen;
    this.updatePage();
    
  }
  
  //go to previous page
  previousPage(){
    this.indexOfFirstImage = this.indexOfFirstImage - this.amountOfPagesOnScreen;
    this.updatePage();
  }
  
  //update page numbers
  updatePage(){
    
    this.previousPageAvailable = true;
    this.nextPageAvailable = true;
    
    if(this.indexOfFirstImage <= 0){
      this.indexOfFirstImage = 0;
      this.previousPageAvailable = false;
    }
    if(this.indexOfFirstImage + this.amountOfPagesOnScreen > this.response.length){
      this.indexOfFirstImage = this.response.length - this.amountOfPagesOnScreen;
      this.nextPageAvailable = false;
    } 
    this.currentImagesOnPage = this.response.slice(
      this.indexOfFirstImage, this.indexOfFirstImage+this.amountOfPagesOnScreen
      );
      
      //console.log(this.currentImagesOnPage);
  }
  
  
  //saves selected collection option
  selectCollection(collection){
    this.selectedCollection = collection;
  }
  
  //resets collection option when new modal is open
  resetCollectionOptions(){
    this.selectedCollection = '';
    
  }
  
  //when collection is selected, save can be clicked
  saveIsValid(){
    if(this.selectedCollection == ''){
      return false;
    }else
      return true;
    
  }
  
  //saves to collection
  saveToCollection(image){
    
    this._collectionsService.addToCollection(this.selectedCollection["_id"], image.data[0].nasa_id);
  }
  

}
