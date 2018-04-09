import { Component, OnInit } from '@angular/core';
import { SignInService } from '../sign-in.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerResponse = '';
  loading = false;
  resend = false;
  email = '';
  
  constructor(private _signInService: SignInService) { }

  ngOnInit() {
  }
  
  //register user
  registerForm(form){
    this.loading = true;
    this.email = form.value['email'];
    this._signInService.register(form.value['email'], form.value['password'], this.onRegisterResponse.bind(this));
  }
  
  //or user response
  onRegisterResponse(res){
    this.registerResponse = res.msg;
    
    if(this.registerResponse == "You have already signed up. Please check your email to verify your account.")
      this.resend = true;
    else
      this.resend = false;
      
    this.loading = false;
  }
  
  //to resend email
  resendEmail(){
    console.log("sending email again");
    if(this.email != '')
      this._signInService.resendEmail(this.email);
    this.resend = false;  
  }

}
