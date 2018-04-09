import { Component, OnInit } from '@angular/core';
import { SignInService } from '../sign-in.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  loggedIn = false;

  constructor(private _signInService: SignInService) { }

  ngOnInit() {
    this.loggedIn = this._signInService.loggedIn;
    
    //console.log(this.loggedIn);
  }

}
