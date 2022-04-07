import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { QuoteService } from '../shared/quotes.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css'],
})
export class AuthorComponent implements OnInit {
  dropdownList: any;
  dropdownSettings: any;
  form!: FormGroup;
  errorMessage = '';
  authors: any = [];
  showQuotes = false;
  searchedAuthor = '';

  private notifier = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      authorsFg: ['', [Validators.required]],
    });
    this.getData();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  handleButtonClick() {
    this.showQuotes = true;
    this.searchedAuthor = this.form.value.authorsFg[0].item_text;
    console.log('reactive form value ', this.form.value.authorsFg[0].item_text);
  }

  onItemSelect($event: any) {
    console.log('$event is ', $event);
  }

  getData() {
    this.quoteService
      .getAuthors()
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (response) => {
          this.modifyData(response);
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  modifyData(response: any) {
    response.forEach((element: any, index: any) => {
      this.authors.push({ item_id: index + 1, item_text: element.author });
    });
    this.dropdownList = this.authors;
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
    };
  }
}
