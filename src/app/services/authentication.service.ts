import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';

@Injectable()
export class AuthenticationService {
  private _isAuthorized: boolean = false;
  private _sessionAuthData: any;
  private _userData: User;

  constructor(private _http: Http) { }

  isUserAuthorized(): boolean {
    this._isAuthorized = false;
    this._sessionAuthData = JSON.parse(sessionStorage.getItem('authData'));

    if (this._sessionAuthData && this._sessionAuthData.token) {
      this._authorizeUser(this._sessionAuthData.token);
      this._isAuthorized = true;
    }

    return this._isAuthorized;
  }

  hasUserPermission(types: any): boolean {
    let isPermission = false;
    this._userData = JSON.parse(sessionStorage.getItem('currentUser'));

    if (this._userData) {
      if(typeof types == 'undefined')
        isPermission = true;
      else if(types.indexOf(this._userData.type) > -1)
        isPermission = true;
    }

    return isPermission;
  }

  login(email: string, password: string) {
    return this._http.post(environment.apiUrl + '/users/authenticate', { email: email, password: password })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let data = response.json();
        if (data && data.token) {
          this._authorizeUser(data.token);
        }
        return data;
      });
  }

  socialLogin(accessToken: string, type: string) {
    return this._http.post(environment.apiUrl + '/users/authorize/' + type, { accessToken: accessToken })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let data = response.json();
        if (data && data.token) {
          this._authorizeUser(data.token);
        }
        return data;
      });
  }

  verify(verifyToken: string) {
    return this._http.post(environment.apiUrl + '/users/verify', { verifyToken: verifyToken })
      .map((response: Response) => {
        let data = response.json();
        return data;
      });
  }

  logout() {
    this._isAuthorized = false;
    this._userData = null;
    sessionStorage.removeItem('authData');
    sessionStorage.removeItem('currentUser');
  }

  getAuthData() {
    this._sessionAuthData = JSON.parse(sessionStorage.getItem('authData'));
    return this._sessionAuthData;
  }

  setUserData(user: User) {
    this._userData = user;
    sessionStorage.setItem('currentUser', JSON.stringify(this._userData));
  }

  getUserData() {
    this._userData = JSON.parse(sessionStorage.getItem('currentUser'));
    return this._userData;
  }

  private _authorizeUser(token: string) {
    let authData: AuthData = {
      token: token
    };

    this._isAuthorized = true;

    sessionStorage.setItem('authData', JSON.stringify(authData));
  }
}
