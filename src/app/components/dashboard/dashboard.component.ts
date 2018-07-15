import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as mtz from 'moment-timezone';

import { TimezoneService } from '../../services/index';
import { Timezone } from '../../models/timezone.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  timezones: Timezone[] = [];
  filteredTimezones: Timezone[] = [];

  constructor(
    private _router: Router,
    private _timezoneService: TimezoneService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getTimezonesByUser();
  }

  deleteTimezone(timezone) {
    if(!confirm('Would you like to delete this timezone?')) return;
    this._timezoneService.destroy(timezone)
      .subscribe(
        data => {
          this.getTimezonesByUser();
          this._toastr.success('Timezone deleted successfully.');
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
        }
      );
  }

  onSearchChange (searchValue : string) {
    this.filteredTimezones = this.timezones.filter(
      user => (user.name && user.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)
    );
  }

  getDifftoGMT(timezone: string) {
    return mtz.tz(timezone).format('Z z');
  }

  getCurrentTimeByTimezone(timezone: string) {
    return mtz.tz(timezone).format('MMMM Do YYYY, h:mm:ss a');
  }

  private getTimezonesByUser() {
    this._timezoneService.getTimezonesByUser().subscribe(
      timezones => {
        this.timezones = timezones;
        this.filteredTimezones = timezones;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._toastr.error(message);
      }
    );
  }

}
