import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from './user';

function checkTruthy(c: AbstractControl): { [key: string]: boolean } | null {
  const readingControl = c.get('reading');
  const singingControl = c.get('singing');
  const otherControl = c.get('other');
  const othertext = c.get('othertext');

  if (
    readingControl?.pristine &&
    singingControl?.pristine &&
    otherControl?.pristine
  ) {
    return { pristine: true };
  }

  if (otherControl?.value) {
    if (othertext?.pristine) return { pristine: true };
    if (othertext?.value.length < 3) return { length: true };
  }

  if (readingControl?.value || singingControl?.value || otherControl?.value) {
    return null;
  }

  return { required: true };
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent implements OnInit {
  userSettingForm!: FormGroup;
  user = new User();

  constructor(private modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userSettingForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', [Validators.required]],
      hobbyGroup: this.fb.group(
        {
          reading: false,
          singing: false,
          other: false,
          othertext: '',
        },
        { validator: checkTruthy }
      ),
      description: ['', [Validators.required]],
    });

    // console.log(this.userSettingForm.get('hobbyGroup')?.value.other);
  }

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

  resetForm(): void {
    this.userSettingForm.reset();
  }

  save(): void {
    console.log(this.userSettingForm);
    console.log('Saved: ' + JSON.stringify(this.userSettingForm.value));
  }
}
