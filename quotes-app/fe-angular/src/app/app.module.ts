import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { AccordianAuthorsComponent } from './accordian-authors/accordian-authors.component';
import { ChartsComponent } from './charts/charts.component';
import { ChartSemiCircleDonutComponent } from './chart-semi-circle-donut/chart-semi-circle-donut.component';
import { ChartBasicColumnComponent } from './chart-basic-column/chart-basic-column.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    HomeModule,

    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      {
        path: 'userdetails',
        loadChildren: () =>
          import('./user-details/user-details.module').then(
            (m) => m.UserDetailsModule
          ),
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
