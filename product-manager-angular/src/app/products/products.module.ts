import { NgModule } from '@angular/core';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductDetailGuard } from '../product-detail/product-detail.guard';
import { SharedModule } from '../shared/shared.module';
import { ProductResolver } from '../product-detail/product-resolver.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { ProductEditGuard } from '../product-edit/product-edit.guard';
import {
  HttpClientInMemoryWebApiModule,
  InMemoryWebApiModule,
} from 'angular-in-memory-web-api';
import { ProductDataService } from './product-data.service';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailComponent,
    ProductEditComponent,
  ],
  imports: [
    NgbModule,
    SharedModule,

    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: '', component: ProductsComponent },
          {
            path: ':id',
            canActivate: [ProductDetailGuard],
            component: ProductDetailComponent,
            resolve: { resolvedData: ProductResolver },
          },
          {
            path: ':id/edit',
            canDeactivate: [ProductEditGuard],
            component: ProductEditComponent,
          },
        ],
      },
    ]),
  ],
})
export class ProductsModule {}

// @NgModule({
//   declarations: [ProductsComponent, ProductDetailComponent],
//   imports: [
//     SharedModule,
//     RouterModule.forChild([
//       { path: 'products', component: ProductsComponent },
//       {
//         path: 'products/:id',
//         canActivate: [ProductDetailGuard],
//         component: ProductDetailComponent,
//         resolve: { resolvedData: ProductResolver },
//       },
//     ]),
//   ],
// })
