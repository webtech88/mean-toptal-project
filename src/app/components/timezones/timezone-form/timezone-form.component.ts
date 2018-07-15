import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

import { TimezoneService } from '../../../services/index';
import { Timezone } from '../../../models/timezone.model';

@Component({
  selector: 'app-timezone-form',
  templateUrl: './timezone-form.component.html',
  styleUrls: ['./timezone-form.component.scss']
})
export class TimezoneFormComponent implements OnInit, OnDestroy {
  id: String;
  timezone: any = {};
  loading: boolean = false;

  @ViewChild("placesRef") placesRef : ElementRef;

  private _subscribe: any;
  public options ={
    types: ['(cities)']
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _timezoneService: TimezoneService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this._subscribe = this._route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.getTimezoneById();
      }

    });
  }

  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }

  goPrevPage() {
    this._location.back();
  }

  addressChange(v) {
    if (v === '') {
      this.timezone.city = '';
    }
  }

  handleAddressChange(place: any) {       
      this.timezone.city = place['formatted_address'];
      var location = place['geometry']['location'];
      this.timezone.location = {
        lat : location.lat(),
        lng : location.lng()
      };
  }

  save() {
    (this.id ? this._timezoneService.update(this.timezone) : this._timezoneService.create(this.timezone))
      .subscribe(
        data => {
          this.loading = false;
          let message = this.id ? 'Timezone updated successfully.' : 'Timezone created successfully.';
          this._toastr.success(message);
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

  private getTimezoneById() {
    this._timezoneService.getTimezoneById(this.id).subscribe(
      timezone => {
        this.timezone = timezone;
        this.placesRef.nativeElement.value = timezone.city;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._toastr.error(message);
        this.goPrevPage();
      }
    );
  }

}
