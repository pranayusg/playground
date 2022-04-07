import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct, ProductResolved } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  @Input() id = 0;
  pageTitle = 'Product Detail';
  showCardFooter = true;
  showImage = true;
  errorMessage = '';
  product: IProduct | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    if (this.id === 0) {
      const resolvedData: ProductResolved = (this.route.snapshot.data as any)
        .resolvedData;

      if (resolvedData.error) {
        this.errorMessage = resolvedData.error;
      }

      this.onProductRetrieved(resolvedData.product);
    } else {
      this.showCardFooter = false;
      this.showImage = false;
      this.getProduct(this.id);
    }

    // Using state data passed from routing through other component and if not fetch using route id

    // const id = Number(this.route.snapshot.paramMap.get('id'));
    // history.state.data
    //   ? (this.product = history.state.data.product)
    //   : this.getProduct(id);

    // console.log(history.state.data);
  }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => (this.product = product),
      error: (err) => (this.errorMessage = err),
    });
  }

  onProductRetrieved(product: IProduct | null): void {
    if (product) this.product = product;

    if (this.product) {
      this.pageTitle = `Product Detail: ${this.product.productName}`;
    } else {
      this.pageTitle = 'No product found';
    }
  }

  onBack(): void {
    this.router.navigate(['/products'], { queryParamsHandling: 'preserve' });
  }
}
