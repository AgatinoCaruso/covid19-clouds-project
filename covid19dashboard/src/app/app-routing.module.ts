import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
