import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { Forms_Module } from './form-demo/form.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductDataService } from './products/product-data.service';

@NgModule({
  declarations: [AppComponent, WelcomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      // { path: 'form', component: WelcomeComponent },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
    ]),
    Forms_Module,
    HttpClientInMemoryWebApiModule.forRoot(ProductDataService),
    // ProductsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
