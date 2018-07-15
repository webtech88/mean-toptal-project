import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class TimezoneService {

  constructor(
    private _http: Http,
    private _authenticationService: AuthenticationService
  ) { }

  getAll() {
    return this._http.get(environment.apiUrl + '/timezones/all', this.getHeader())
      .map((response: Response) => response.json());
  }

  getTimezonesByUser() {
    return this._http.get(environment.apiUrl + '/timezones', this.getHeader())
      .map((response: Response) => response.json());
  }

  getTimezoneById(id: String) {
    return this._http.get(environment.apiUrl + '/timezone/' + id, this.getHeader())
      .map((response: Response) => response.json());
  }

  create(timezone) {
    return this._http.post(environment.apiUrl + '/timezone', timezone, this.getHeader())
      .map((response: Response) => response.json());
  }

  update(timezone) {
    return this._http.put(environment.apiUrl + '/timezone/' + timezone._id, timezone, this.getHeader())
      .map((response: Response) => response.json());
  }

  destroy(timezone) {
    return this._http.delete(environment.apiUrl + '/timezone/' + timezone._id, this.getHeader())
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
