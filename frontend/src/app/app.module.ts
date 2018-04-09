import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ImagesComponent } from './images/images.component';
import { ImageCollectionComponent } from './image-collection/image-collection.component';
import { CollectionsComponent } from './collections/collections.component';
import { SingleImageComponent } from './single-image/single-image.component';
import { RegisterComponent } from './register/register.component';
import { EmailPageComponent } from './email-page/email-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DmcaComponent } from './dmca/dmca.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

import { ImagesService } from './images.service';
import { CollectionsService } from './collections.service';
import { SignInService } from './sign-in.service';
import { CookieService } from 'ng2-cookies';
import { PoliciesService } from './policies.service';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    NavbarComponent,
    SignInComponent,
    ImagesComponent,
    ImageCollectionComponent,
    CollectionsComponent,
    SingleImageComponent,
    RegisterComponent,
    EmailPageComponent,
    PrivacyPolicyComponent,
    DmcaComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    StarRatingModule,
    RouterModule.forRoot([
      {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: AboutComponent
      },
      
      {
        path: 'sign-in',
        component: SignInComponent
      },
      {
        path: 'images',
        component: ImagesComponent
      },
      {
        path: 'collections',
        component: CollectionsComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'email-verification/:id',
        component: EmailPageComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'dmca',
        component: DmcaComponent
      },
      {
        path: 'admin-page',
        component: AdminPageComponent
      }
      ])
  ],
  providers: [ImagesService, CollectionsService, SignInService, CookieService, PoliciesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
