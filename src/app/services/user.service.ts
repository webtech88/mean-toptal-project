import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class UserService {

  constructor(
    private _http: Http,
    private _authenticationService: AuthenticationService
  ) { }

  getProfile() {
    return this._http.get(environment.apiUrl + '/users/profile', this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  register(user) {
    return this._http.post(environment.apiUrl + '/users', user, this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  getAll() {
    return this._http.get(environment.apiUrl + '/users', this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  getUserById(id) {
    return this._http.get(environment.apiUrl + '/user/' + id, this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  update(user) {
    return this._http.put(environment.apiUrl + '/user/' + user._id, user, this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  create(user) {
    return this._http.post(environment.apiUrl + '/user/new', user, this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  destroy(user) {
    return this._http.delete(environment.apiUrl + '/user/' + user._id, this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  restore(user) {
    return this._http.put(environment.apiUrl + '/users/restore', {userId: user._id}, this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  resetPassword(user) {
    return this._http.put(environment.apiUrl + '/users/password/' + user._id, user, this.getHeader())
      .map(
        (response: Response) => response.json()
      );
  }

  updateProfile(user) {
    return this._http.put(environment.apiUrl + '/users/profile', user, this.getHeader())
      .map((response: Response) => response.json());
  }

  uploadPhoto(formData) {
    return this._http.post(environment.apiUrl + '/users/photo', formData, this.getHeader())
      .map((response: Response) => response.json());    
  }

  // private helper methods
  private getHeader() {
    // create authorization header with jwt token
    let authData = this._authenticationService.getAuthData();
    if (authData && authData.token) {
      let headers = new Headers({ 'x-access-token': authData.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
