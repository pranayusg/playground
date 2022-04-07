import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { auth } from '../shared/authHelper';
import { QuoteService } from '../shared/quotes.service';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.css'],
})
export class CardItemComponent implements OnInit, OnChanges {
  @Input() quoteItem: any = {};
  @Input() isLiked = false;
  @Input() isDisliked = false;
  likeCount = 0;
  dislikeCount = 0;
  isLike = this.isLiked;
  isDislike = this.isDisliked;

  isLoggedIn = auth.isLoggedIn();
  tags: any = [];
  likeImgSrc = 'assets/icons/like-unfilled.jpg';
  disLikeImgSrc = 'assets/icons/like-unfilled.jpg';
  errorMessage = '';

  private notifier = new Subject<void>();

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.cleanTags();
  }

  ngOnChanges(): void {
    this.setImgSrc();
    this.likeCount = this.quoteItem.likes;
    this.dislikeCount = this.quoteItem.dislikes;
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  setImgSrc() {
    this.likeImgSrc = this.isLiked
      ? 'assets/icons/like-filled.png'
      : 'assets/icons/like-unfilled.jpg';

    this.disLikeImgSrc = this.isDisliked
      ? 'assets/icons/like-filled.png'
      : 'assets/icons/like-unfilled.jpg';
  }

  cleanTags() {
    this.quoteItem.tags.split(',').map((tag: string) => this.tags.push(tag));
  }

  onClickLike = async (id: string) => {
    if (this.isLiked) {
      await this.quoteService
        .likeDown(id)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (response) => {
            // console.log(response);
          },
          error: (err) => (this.errorMessage = err),
        });

      this.isLiked = false;
      this.likeCount = this.likeCount - 1;
    } else {
      await this.quoteService
        .likeUp(id)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (err) => (this.errorMessage = err),
        });

      this.isLiked = true;
      this.likeCount = this.likeCount + 1;
    }

    if (this.isDisliked) {
      this.isDisliked = false;
      this.dislikeCount = this.dislikeCount - 1;
    }

    this.setImgSrc();
  };

  onClickDislike = async (id: string) => {
    if (this.isDisliked) {
      await this.quoteService
        .dislikeDown(id)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (response) => {
            // console.log(response);
          },
          error: (err) => (this.errorMessage = err),
        });

      this.isDisliked = false;
      this.dislikeCount = this.dislikeCount - 1;
    } else {
      await this.quoteService
        .dislikeUp(id)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (response) => {
            // console.log(response);
          },
          error: (err) => (this.errorMessage = err),
        });
      this.isDisliked = true;
      this.dislikeCount = this.dislikeCount + 1;
    }

    if (this.isLiked) {
      this.isLiked = false;
      this.likeCount = this.likeCount - 1;
    }
    this.setImgSrc();
  };
}
