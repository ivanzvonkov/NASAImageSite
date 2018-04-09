import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class SignInService {

  token = undefined;
  loggedIn = false;

  constructor(private http: HttpClient) { }
    
    getEmail(callback_fun){
      if(this.token != undefined){
        this.http.get('/api/user-email/'+this.token).subscribe(data => {
          callback_fun(data);
        });
      }else{
        callback_fun({email: "no token"});
      }
      
    }
    
    //register user
    register(email, password, callback_fun){
      var type = 'register';
      const body = {email: email, pw: password, type: type};
          this.http.post('/api/register', body).subscribe(data => {
              callback_fun(data);
          });  
    }
    
    //resend verification email
    resendEmail(email){
      const body = {email:email};
      
      this.http.put('/api/resend-verification', body).subscribe(data => {
          console.log(data);  
      });
    }
    
    //login user
    login(email, password, callback_fun){
        
        const body = {email: email, pw: password};
          this.http.post('/api/login', body).subscribe(data => {
              
              if(data.hasOwnProperty('token')){
                this.setToken( data["token"] );
                this.loggedIn = true;
              }callback_fun(data);
          });
    }
    
    //set user token
    setToken(token){
      this.token = token;
    }
    
    //get user token
    getToken(){
      return this.token;
    }
    
    //verify user email
    verifyEmail(id, callback_fun){
      this.http.get('/api/email-verification/'+id).subscribe(data => {
        callback_fun(data);
      });
    }
    
    

}
