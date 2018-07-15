import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { User } from './models/user.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isUserAuthorized: boolean = false;
  currentUser: User;

  title = 'app';

  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) {
    this._router.events.subscribe(() => {
      this.isUserAuthorized = this._authenticationService.isUserAuthorized();
      this.currentUser = this._authenticationService.getUserData();
    });
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigateByUrl('/login');
  }
}
