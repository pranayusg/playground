import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { auth } from '../shared/authHelper';
import { QuoteService } from '../shared/quotes.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
})
export class QuotesComponent implements OnInit {
  @Input() quoteType = '';
  @Input() tag = '';
  @Input() author = '';
  quotesData: any = [];
  favQuotesData: any = [];
  unfavQuotesData: any = [];
  errorMessage = '';

  private notifier = new Subject<void>();

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    if (auth.isLoggedIn()) this.fetchFavQuotes();
  }

  ngOnChanges(): void {
    this.getQuotes();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  getQuotes() {
    if (this.quoteType === 'All') {
      this.quoteService
        .getQuotes()
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (response) => {
            this.quotesData = response;
          },
          error: (err) => (this.errorMessage = err),
        });
    }
    if (this.quoteType === 'Tag') {
      this.quoteService
        .getQuotesByTag(this.tag)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (response) => {
            this.quotesData = response;
          },
          error: (err) => (this.errorMessage = err),
        });
    }

    if (this.quoteType === 'Authors') {
      this.quoteService
        .searchQuotesByAuthor(this.author)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (response) => {
            this.quotesData = response;
          },
          error: (err) => (this.errorMessage = err),
        });
    }
  }

  fetchFavQuotes() {
    this.quoteService
      .getMyfavQuotes()
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.favQuotesData = response;
        },
        error: (err) => (this.errorMessage = err),
      });

    this.quoteService
      .getMyUnfavQuotes()
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.unfavQuotesData = response;
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  isLiked = (key: string) => {
    let likeFlag = false;
    if (this.favQuotesData.length === 0) return false;
    this.favQuotesData.forEach((likedQuote: any) => {
      if (likedQuote.quote.id === key) {
        likeFlag = true;
      }
    });
    return likeFlag;
  };

  isDisliked = (key: string) => {
    let dislikeFlag = false;
    if (this.unfavQuotesData.length === 0) return false;
    this.unfavQuotesData.forEach((dislikedQuote: any) => {
      if (dislikedQuote.quote.id === key) dislikeFlag = true;
    });
    return dislikeFlag;
  };
}
