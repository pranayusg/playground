import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QuoteService } from '../shared/quotes.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  @Output() tagClicked: EventEmitter<string> = new EventEmitter<string>();

  tagsData: any = [];
  errorMessage: string = '';

  constructor(private quotesService: QuoteService) {}

  ngOnInit(): void {
    this.fetchTags();
  }

  fetchTags() {
    this.quotesService.getAllTags().subscribe({
      next: (response: any) => (this.tagsData = response),
      error: (err) => (this.errorMessage = err),
    });
  }

  onTagClick(tagName: any) {
    this.tagClicked.emit(tagName.innerText);
  }
}
