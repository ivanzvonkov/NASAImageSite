import { Component, OnInit } from '@angular/core';
import { PoliciesService } from '../policies.service';

@Component({
  selector: 'app-dmca',
  templateUrl: './dmca.component.html',
  styleUrls: ['./dmca.component.css']
})
export class DmcaComponent implements OnInit {

  /*dmcaBody = {
    name:'dmca',
    text:`<h1>DMCA Notice & Takedown Policy </h1>
            <p>
              Nasa Collections supports the protection of intellectual property and asks their users to do 
              the same. It is our policy to expeditiously respond to clear notices of alleged copyright infringement 
              that comply with the United States Digital Millennium Copyright Act (“DMCA”), the text of 
              which can be found at the U.S. Copyright Office website, 
              <a target="_blank" href="https://www.copyright.gov">https://www.copyright.gov</a>.
            </p>
            <p>
              It is expected that all users of Nasa Collections will comply with applicable copyright 
              laws. If, however, we receive proper notification of claimed copyright infringement, our 
              response to such notices will include removing or disabling access to material claimed to 
              be the subject of infringing activity and/or terminating the subscriber.
            </p>
            <p>
              Please use the following form to report content on Nasa Collections that you believe violates or 
              infringes your copyright. Should you wish not to use our online form, please provide all 
              of the information requested below in a written communication sent to our designated
              <a target="_blank" href="mailto:ivan.zvonkov2@gmail.com">agent</a>. 
              In order to be effective, any such notification must include a physical 
              or electronic signature of a person authorized to act on behalf of the owner of the exclusive 
              copyright right that is allegedly infringed and must include a statement that the information 
              in the notification is accurate, and under penalty of perjury, that the complaining party is 
              authorized to act on behalf of the owner of the exclusive right that is allegedly infringed. 
              Please note that you will be liable for damages (including costs and attorney's fees) if you 
              materially misrepresent that material is infringing your copyright(s). Accordingly, if you are 
              not sure if you are the proper copyright holder or if copyright laws protect the material, we suggest 
              that you first contact a lawyer.
            </p>`
  };*/
  dmcaBody = {};

  constructor(private _policiesService:PoliciesService) { }

  ngOnInit() {
    this._policiesService.getPolicy(this.onPolicyResponse.bind(this), 'dmca');
  }
  
  onPolicyResponse(res){
    this.dmcaBody = res;
  }

}
