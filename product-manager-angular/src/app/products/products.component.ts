import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { IProduct } from './product';
import { ProductService } from './products.service';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private notifier = new Subject<void>();

  pageTitle = 'Product List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';
  // sub!: Subscription;

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    console.log(value);
    this._listFilter = value;
    this.filteredProducts = this.listFilter
      ? this.performFilter(this.listFilter)
      : this.products;
  }

  filteredProducts: IProduct[] = [];
  products: IProduct[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  toggleImage() {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    this.showImage =
      this.route.snapshot.queryParamMap.get('showImage') === 'true';
    // this.sub=
    this.productService
      .getProducts()
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.listFilter =
            this.route.snapshot.queryParamMap.get('filterBy') || '';
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
    this.notifier.next();
    this.notifier.complete();
  }

  performFilter(filterBy: string): IProduct[] {
    console.log('filterBy' + filterBy);
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: IProduct) =>
      product.productName.toLocaleLowerCase().includes(filterBy)
    );
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }

  toggleAccordion(i: number): void {
    document.querySelector('.table tr#collapse-' + i)?.classList.toggle('open');
    document.querySelector('#arrow-' + i)?.classList.toggle('open');
  }
}
