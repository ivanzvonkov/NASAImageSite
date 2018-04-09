import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class CollectionsService {

      constructor( private http: HttpClient ) { }
      
      token = undefined;
      
      setToken(token){
        this.token = token;
        console.log('token set to '+ this.token);
      }
      
      getCollections(callback_fun) {
          
          if(this.token != undefined){
            this.http.get('/api/image-collection/'+this.token).subscribe(data => {
                callback_fun(data);
            });
          }else{
            this.http.get('/api/image-collection').subscribe(data => {
                callback_fun(data);
            });
          }
          
      }
      
      addToCollection(collection_id, nasa_id){
          const empty = {};
          this.http.put('/api/image-collection/'+collection_id+'/'+nasa_id, empty).subscribe(data => {
              console.log(data);
          });
      }
      
      createCollection(collection_title, collection_description, collection_privacy, token, callback_fun){
          const body = {title: collection_title, collectionDescription: collection_description, privacy:collection_privacy, token: token};
          
          
          this.http.post('/api/image-collection', body).subscribe(data => {
              console.log(data);
              this.getCollections(callback_fun);
              
          });
      }
      
      deleteCollection(collection_id, callback_fun){
          this.http.delete('/api/image-collection/'+collection_id).subscribe(data => {
              console.log(data);
              this.getCollections(callback_fun);
          })
      }
      
      editCollection(collection_id, collection_title, collection_description, collection_privacy/*, callback_fun*/){
          const body = {title: collection_title, collectionDescription: collection_description, privacy:collection_privacy};
          this.http.put('/api/image-collection/'+collection_id, body).subscribe(data => {
              console.log(data);
          });
      }
      
      deleteImage(collection_id, nasa_id){
        this.http.delete('/api/image-collection/'+collection_id+'/'+nasa_id).subscribe(data => {
              console.log(data);
          });  
      }
      
      rateCollection(collection_id, rating, callback_fun){
        
        if(this.token != undefined){
          const empty = {};
          this.http.put('/api/image-collection/rate/'+collection_id+'/'+rating+'/'+this.token, empty).subscribe(data =>{
            console.log(data);
            if(data["message"] == "Can't rate own collection"){
              
            }else{
              this.getCollections(callback_fun);
            }
          });
          
        }
      }

}
