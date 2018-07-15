import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { UserComponent } from './components/users/user/user.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { UserResetPasswordComponent } from './components/users/user-reset-password/user-reset-password.component';
import { TimezoneComponent } from './components/timezones/timezone/timezone.component';
import { TimezoneFormComponent } from './components/timezones/timezone-form/timezone-form.component';
import { AuthGuard } from './guards/index';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  // user
  { path: 'users', component: UserComponent, canActivate: [AuthGuard], data: { types: ['manager', 'admin'] } },
  { path: 'users/new', pathMatch: 'full', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['manager', 'admin'] } },
  { path: 'users/profile', pathMatch: 'full', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'users/reset/:id', component: UserResetPasswordComponent, canActivate: [AuthGuard] },
  { path: 'users/:id', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['manager', 'admin'] } },  
  // timezone
  { path: 'timezones', component: TimezoneComponent, canActivate: [AuthGuard], data: { types: ['admin'] } },
  { path: 'timezones/new', pathMatch: 'full', component: TimezoneFormComponent, canActivate: [AuthGuard] },
  { path: 'timezones/:id', component: TimezoneFormComponent, canActivate: [AuthGuard] },
  
  // otherwise redirect to dashboard
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
