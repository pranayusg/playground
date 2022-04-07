import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductResolved } from '../products/product';
import { ProductService } from '../products/products.service';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver implements Resolve<ProductResolved> {
  constructor(private productService: ProductService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id: any = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `Product id was not a number: ${id}`;
      console.error(message);
      return of({ product: null, error: message });
    }

    return this.productService.getProduct(+id).pipe(
      map((product) => ({ product })),
      catchError((error) => {
        // console.log('hello');
        const message = `Retrieval error: ${error}`;
        // console.error(message);
        return of({ product: null, error: message });
      })
    );
  }
}
