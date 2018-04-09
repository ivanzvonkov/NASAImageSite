import { Component, OnInit } from '@angular/core';
import { SignInService } from '../sign-in.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-email-page',
  templateUrl: './email-page.component.html',
  styleUrls: ['./email-page.component.css']
})
export class EmailPageComponent implements OnInit {

  constructor(private _s:SignInService, private _activatedRoute: ActivatedRoute) { }
  
  verified = false;

  ngOnInit() {
    this._activatedRoute.params.subscribe( p => {
        let id = p['id'];
        this._s.verifyEmail(id, this.onVerifyResponse.bind(this)); 
    });
  }
  
  onVerifyResponse(res){
    if(res.msg){
      this.verified = true;
    }else
      this.verified = false;
  }
  

}
