import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService, AuthenticationService } from '../../../services/index';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  loading: boolean = false;
  imgLoading: boolean = false;
  currentUser: User;

  constructor(
    private _router: Router,
    private _location: Location,
    private _userService: UserService,
    private _authenticationService: AuthenticationService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.currentUser = this._authenticationService.getUserData();
    this.user = this.currentUser;
  }

  goPrevPage() {
    this._location.back();
  }

  triggerFile(fileInput:HTMLElement) {
    fileInput.click();
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInput.target.files[0]);
      this.fileUpload(formData);
    }
  }

  fileUpload(formData) {
    this.imgLoading = true;
    this._userService.uploadPhoto(formData)
      .subscribe(
        data => {
          this.imgLoading = false;
          this._toastr.success('Uploaded successfully.');
          this.user.photo = data.photo;
          this._authenticationService.setUserData(this.user);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
          this.imgLoading = false;
        }
      );
  }

  save() {
    this.loading = true;
    this._userService.updateProfile(this.user)
      .subscribe(
        data => {
          this.loading = false;
          this._toastr.success('Your Profile updated successfully.');
          this.goPrevPage();
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
