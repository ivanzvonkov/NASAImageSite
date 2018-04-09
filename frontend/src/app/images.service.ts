import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class ImagesService {

  constructor(private http: HttpClient) { }
  
  getData(callback_fun, searchTerm) {
      
      //ensure url is safe
      searchTerm = searchTerm.replace(/[^a-z0-9]/gi, '%20').toLowerCase();
      
      
      this.http.get('/api/nasa/search/'+searchTerm).subscribe(data => {
          
          
          let images = [ ];
          let response = data['collection']['items'];
          
          for(let i = 0; i < response.length; i++){
              
              if(response[i].hasOwnProperty('links')){
                
                //console.log(response[i]['links'][0]['render']);
                
                if(response[i]['links'][0]['render'] == 'image')
                  images.push(response[i]);
              }
          }
          callback_fun(images);
      });
  }
  
  

}
