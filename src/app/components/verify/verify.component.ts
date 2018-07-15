import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../services/index';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  verifyToken: string;
  verifyString: string = 'Verifying ...';
  verified: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.verifyToken = this._route.snapshot.queryParams['t'] || '';
    this._authenticationService.verify(this.verifyToken)
      .subscribe(
        data => {
          if (data.verified) {
            this.verifyString = "Verified Successfully!";
            this.verified = true;
          }
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
          this.verifyString = "Can't Verify your Account.";
          this.verified = false;
        }
      );
  }

}
