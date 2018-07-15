import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService, AuthenticationService } from '../../../services/index';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentUser: User;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _authenticationService: AuthenticationService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.currentUser = this._authenticationService.getUserData();
    this.getAllUsers();
  }

  deleteUser(user) {
    if(!confirm('Would you like to delete this user?')) return;
    this._userService.destroy(user)
      .subscribe(
        data => {
          this.getAllUsers();
          this._toastr.success('User deleted successfully.');
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
        }
      );
  }

  restoreUser(user) {
    this._userService.restore(user)
      .subscribe(
        data => {
          this.getAllUsers();
          this._toastr.success('User restored successfully.');
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
        }
      );
  }

  onSearchChange (searchValue : string) {
    this.filteredUsers = this.users.filter(
      user => 
        (
              (user.firstName && user.firstName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) 
          ||  (user.lastName && user.lastName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)
          ||  (user.email && user.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)
        )
    );
  }

  private getAllUsers() {
    this._userService.getAll().subscribe(
      users => {
        this.users = users;
        this.filteredUsers = users;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._toastr.error(message);
      }
    );
  }

}
