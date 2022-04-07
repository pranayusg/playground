import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { QuoteService } from '../shared/quotes.service';
import { alertHelpers } from '../shared/alertsHelper';
import { auth } from '../shared/authHelper';
import { UserSignIn, userSignInBody } from './userSignin';

const swalProps = {
  title: 'Invalid Credentials!!',
  icon: 'error',
};

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  userSignIn = new UserSignIn();
  errorMessage!: string;

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

  save(userSignInForm: NgForm): void {
    // console.log(userSignInForm.form);
    // console.log('Saved: ' + JSON.stringify(userSignInForm.value));

    let payload: userSignInBody = {
      username: userSignInForm.value.email,
      password: userSignInForm.value.password,
    };
    this.userService.signIn(payload).subscribe({
      next: (response: any) => this.onSuccess(response, userSignInForm),
      error: (err) => this.onFail(),
    });
  }

  resetForm(userSignInForm: NgForm): void {
    userSignInForm.reset();
  }

  onSuccess(response: any, userSignInForm: NgForm): void {
    if (response.username) {
      auth.setAuthValues(response);
      this.modalService.dismissAll();
      userSignInForm.reset();
      window.location.reload();

      // if (auth.isLoggedIn()) {
      // 	props.setLogIn();
      // }
    } else {
      alertHelpers.getInvalidLoginAlert({ ...swalProps });
    }
  }

  onFail(): void {
    alertHelpers.getInvalidLoginAlert({ ...swalProps });
  }
}
