import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { QuoteService } from '../shared/quotes.service';
import { NewQuote, Quote } from './newQuote';

@Component({
  selector: 'app-new-quote-modal',
  templateUrl: './new-quote-modal.component.html',
  styleUrls: ['./new-quote-modal.component.css'],
})
export class NewQuoteModalComponent implements OnInit {
  newQuote = new NewQuote();
  errorMessage!: string;

  constructor(
    private modalService: NgbModal,
    private quotesService: QuoteService
  ) {}

  ngOnInit(): void {}

  closeResult = '';

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
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

  save(newQuoteForm: NgForm): void {
    console.log(newQuoteForm.form);
    console.log('Saved: ' + JSON.stringify(newQuoteForm.value));
    let payload: Quote = {
      quote: newQuoteForm.value.quote,
      author: newQuoteForm.value.author,
      tags: newQuoteForm.value.tags,
    };
    this.quotesService.createQuotes(payload).subscribe({
      next: (response: any) => this.onSuccess(response, newQuoteForm),
      error: (err) => (this.errorMessage = err),
    });
  }

  resetForm(userSignInForm: NgForm): void {
    userSignInForm.reset();
  }

  onSuccess(response: any, newQuoteForm: NgForm): void {
    this.modalService.dismissAll();
    newQuoteForm.reset();
    // window.location.reload();
  }
}
