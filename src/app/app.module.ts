import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomFormsModule } from 'ng2-validation'
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular5-social-login";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import { routing } from './app.routing';

import { AuthGuard } from './guards/index';
import { AuthenticationService, UserService, TimezoneService } from './services/index';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { UserComponent } from './components/users/user/user.component';
import { IsAllowingPipe } from './pipes/is-allowing.pipe';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { UserResetPasswordComponent } from './components/users/user-reset-password/user-reset-password.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { TimezoneComponent } from './components/timezones/timezone/timezone.component';
import { TimezoneFormComponent } from './components/timezones/timezone-form/timezone-form.component';

const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('676584329183-ulkk8pqsk5nik97khk8k1pk7e9bcblcg.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('277338632795642')
  }
]);

// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("277338632795642")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("676584329183-ulkk8pqsk5nik97khk8k1pk7e9bcblcg.apps.googleusercontent.com")
        }
      ]
  );

  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    UserComponent,
    IsAllowingPipe,
    UserFormComponent,
    UserResetPasswordComponent,
    UserProfileComponent,
    TimezoneComponent,
    TimezoneFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CustomFormsModule,
    ToastrModule.forRoot(), // ToastrModule added
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    SocialLoginModule,
    GooglePlaceModule,
    routing
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    TimezoneService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
