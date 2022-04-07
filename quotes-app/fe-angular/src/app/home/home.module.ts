import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewQuoteModalComponent } from '../new-quote-modal/new-quote-modal.component';
import { SigninComponent } from '../signin/signin.component';
import { CheckPasswordDirective } from '../signup/comparePassword.directive';
import { SignupComponent } from '../signup/signup.component';
import { PageHeadingComponent } from '../page-heading/page-heading.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { CardItemComponent } from '../card-item/card-item.component';
import { QuotesComponent } from '../quotes/quotes.component';
import { TabsComponent } from '../tabs/tabs.component';
import { MomentModule } from 'ngx-moment';
import { TagsComponent } from '../tags/tags.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { AuthorComponent } from '../author/author.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordianAuthorsComponent } from '../accordian-authors/accordian-authors.component';
import { ChartsComponent } from '../charts/charts.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartBasicColumnComponent } from '../chart-basic-column/chart-basic-column.component';
import { ChartSemiCircleDonutComponent } from '../chart-semi-circle-donut/chart-semi-circle-donut.component';

@NgModule({
  declarations: [
    HomeComponent,
    PageHeadingComponent,
    SignupComponent,
    SigninComponent,
    NewQuoteModalComponent,
    CheckPasswordDirective,
    TabsComponent,
    QuotesComponent,
    CardItemComponent,
    TagsComponent,
    UserMenuComponent,
    AuthorComponent,
    AccordianAuthorsComponent,
    ChartsComponent,
    ChartSemiCircleDonutComponent,
    ChartBasicColumnComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class HomeModule {}
