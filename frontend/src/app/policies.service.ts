import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class PoliciesService {

  constructor(private http: HttpClient) { }
  
  updatePolicy(policyBody, type){
      
      this.http.put('/api/policy/'+type, policyBody).subscribe( data => {
          console.log(data);
      });
  }
  
  postPolicy(policyBody, type){
    this.http.post('/api/policy/'+type, policyBody).subscribe( data => {
          console.log(data);
      }); 
  }
  
  getPolicy(callback_fun, type){
        this.http.get('/api/policy/'+type).subscribe( data => {
          callback_fun(data);
          console.log("Got policy.");
      });  
  }

}
