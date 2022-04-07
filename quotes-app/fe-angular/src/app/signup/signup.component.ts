import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { alertHelpers } from '../shared/alertsHelper';
import { QuoteService } from '../shared/quotes.service';
import { UserSignUp, userSignUpBody } from './userSignup';

const swalProps = {
  title: 'Something  went wrong',
  icon: 'error',
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  errorMessage!: string;

  userSignUp = new UserSignUp();
  constructor(
    private modalService: NgbModal,
    private userService: QuoteService
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

  save(userSignUpForm: NgForm): void {
    console.log(userSignUpForm.form);
    console.log('Saved: ' + JSON.stringify(userSignUpForm.value));

    let payload: userSignUpBody = {
      userName: userSignUpForm.value.userName,
      email: userSignUpForm.value.email,
      password: userSignUpForm.value.passwords.password,
      confirmPassword: userSignUpForm.value.passwords.confirmPassword,
    };

    this.userService.signUp(payload).subscribe({
      next: (response: any) => this.onSuccess(response, userSignUpForm),
      error: (err) => (this.errorMessage = err),
    });
  }

  resetForm(userSignUpForm: NgForm): void {
    userSignUpForm.reset();
  }

  onSuccess(response: any, userSignUpForm: NgForm): void {
    this.modalService.dismissAll();
    userSignUpForm.reset();
  }

  onFail(): void {
    alertHelpers.getInvalidLoginAlert({ ...swalProps });
  }
}
