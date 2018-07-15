import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { 
  AuthService,
  SocialUser,
  FacebookLoginProvider, 
  GoogleLoginProvider
} from 'angular5-social-login';

import { AuthenticationService, UserService } from '../../services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  user: SocialUser;
  loading = false;
  returnUrl: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _userService: UserService,
    private _toastr: ToastrService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    // reset login status
    this._authenticationService.logout();

    // get return url
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  socialLogin(type: string) {
    const token = (type === 'google') ? this.user.idToken : this.user.token;
    this._authenticationService.socialLogin(token, type)
      .subscribe(
        data => {
          this._userService.getProfile().subscribe(
            user => {
              this._authenticationService.setUserData(user);
              this._toastr.success('Logged in width '+ type +' successfully.');
              this._router.navigate([this.returnUrl]);
            },
            error => {
              error = error.json();
              let message = error.message || 'Something went wrong, please try again.';
              this._toastr.error(message);
              this.loading = false;
            }
          );
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
          this.loading = false;
        }
      );
  }

  signInWithGoogle(): void {
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      this.user = user;
      this.socialLogin('google');
    });
  }

  signInWithFB(): void {
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      this.user = user;
      this.socialLogin('facebook');
    });
  }  

  login() {
    this.loading = true;
    this._authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this._userService.getProfile().subscribe(
            user => {
              this._authenticationService.setUserData(user);
              this._toastr.success('Logged in successfully.');
              this._router.navigate([this.returnUrl]);
            },
            error => {
              error = error.json();
              let message = error.message || 'Something went wrong, please try again.';
              this._toastr.error(message);
              this.loading = false;
            }
          );
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
          this.loading = false;
        }
      );
  }

}
