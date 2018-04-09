import { Component, OnInit } from '@angular/core';
import { SignInService } from '../sign-in.service';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor(private _s: SignInService, private cookie: CookieService) {
    
  }

  ngOnInit() {
    
  }
  
  
  
  logOut(){
    
  }

}
