import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ModalDismissReasons,
  NgbModal,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  OperatorFunction,
  Subject,
  takeUntil,
} from 'rxjs';
import { QuoteService } from '../shared/quotes.service';

const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District Of Columbia',
  'Federated States Of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
];

@Component({
  selector: 'app-accordian-authors',
  templateUrl: './accordian-authors.component.html',
  styleUrls: ['./accordian-authors.component.css'],
})
export class AccordianAuthorsComponent implements OnInit {
  authors: any = [];
  users: any = [];
  errorMessage = '';
  searchedAuthor = '';
  model: any;

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  private notifier = new Subject<void>();

  constructor(
    private quoteService: QuoteService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.users = this.getData();
    this.quoteService
      .getAuthors()
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (response) => {
          response.forEach((element: any) => {
            this.authors.push(element.author);
            // console.log(element.author);
          });
        },
        error: (err) => (this.errorMessage = err),
      });
  }

  closeResult = '';

  open(content: any, event: any) {
    this.searchedAuthor = event.innerText.trim();
    this.modalService
      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.authors
              .filter(
                (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  onselect(item: any) {
    console.log(item);
  }

  getData() {
    return [
      {
        name: 'Pranay',
        quotes: [
          {
            author: 'Will Smith',
            desp: 'thid is  aquote',
          },
          {
            author: 'Domnic Torreto',
            desp: 'thid is  aquote',
          },
          {
            author: 'Jim Carrey',
            desp: 'thid is  aquote',
          },
        ],
      },
      {
        name: 'Sarvesh',
        quotes: [
          {
            author: 'Friedrich Nietzsche',
            desp: 'thid is  aquote',
          },
          {
            author: 'Nelson Mandela',
            desp: 'thid is  aquote',
          },
        ],
      },
      {
        name: 'Issak',
        quotes: [
          {
            author: 'John F. Kennedy',
            desp: 'thid is  aquote',
          },
          {
            author: 'Henry Ford',
            desp: 'thid is  aquote',
          },
        ],
      },
      {
        name: 'Rahul',
        quotes: [
          {
            author: 'John F. Kennedy',
            desp: 'thid is  aquote',
          },
          {
            author: 'Nelson Mandela',
            desp: 'thid is  aquote',
          },
        ],
      },
    ];
  }
}
