import { Component, OnInit } from '@angular/core';
import { SignInService } from '../sign-in.service';
import {Router} from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  //cookies: Object;
  //keys: Array<string>;
  
  loading = false;
  
  signedIn = {email: '', loggedIn: false, emailExists: false};
  loginFailedMessage = '';

  constructor(private _signInService: SignInService, private router:Router/*, public cookieService: CookieService*/) {
    
  }
  

  ngOnInit() {
    //this.cookieService.deleteAll();
    Cookie.set('admin', 'false');
  }
  
  update() {
    
  }
  
  signInForm(form){
    this.loading = true;
    //admin login
    if(form.value['email'] == 'admin@admin' && form.value['password'] == 'admin'){
      
      var email = form.value['email'];
      var password = form.value['password'];
      //this.cookieService.set('admin', 'true');
      Cookie.set('admin', 'true');
      
      this.router.navigate(['/admin-page']);
    }else
      this._signInService.login(form.value['email'], form.value['password'], this.onLoginResponse.bind(this));
  }
  
  onLoginResponse(res){
    console.log(res);
    this.signedIn = res;
    this.loading = false;
    if(this.signedIn.loggedIn)
      this.router.navigate(['/home']);
    else{
      if(this.signedIn.emailExists == false)
        this.loginFailedMessage = "no email exists. Register new account";
      else
        this.loginFailedMessage = "incorrect password, try again";
    }  
  }
  
  

}
