import { Component, OnInit } from '@angular/core';
import { PoliciesService } from '../policies.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  currentPolicy = <any>{};
  
  privacyPolicy = {};
  dmcaPolicy = {};
  
  constructor(private _policiesService: PoliciesService) { }

  ngOnInit() {
    
    this._policiesService.getPolicy(this.onPrivacyPolicyResponse.bind(this), 'privacy');
    this._policiesService.getPolicy(this.onDmcaPolicyResponse.bind(this), 'dmca');
  }
  
  onPrivacyPolicyResponse(res){
    this.privacyPolicy = res;
    this.currentPolicy = this.privacyPolicy;
  }
  
  onDmcaPolicyResponse(res){
    this.dmcaPolicy = res;
  }
  
  currentPrivacy(){
    this.currentPolicy = this.privacyPolicy;
  }
  
  currentDmca(){
    this.currentPolicy = this.dmcaPolicy;
  }
  
  submitPolicy(){
    this._policiesService.updatePolicy(this.currentPolicy, this.currentPolicy.name);
    alert("Updated "+this.currentPolicy.name+" policy.");
    console.log("Updating "+this.currentPolicy.name+" policy.");
  }
  
  

}
