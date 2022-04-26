import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldValidationStatus, Option } from '../../models/formHelpers';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  validationStatus: Option[];
  fieldValidationStatus = FieldValidationStatus;
  targetPracticeTime = 0;
  sessionForm: FormGroup;
  timerForm: FormGroup;
  afterForm: FormGroup;
  practiceTime: AbstractControl;
  whatToPractice: AbstractControl;
  sessionIntent: AbstractControl;
  sessionReflection: AbstractControl;
  goalForNextTime: AbstractControl;
  session: Session;
  practiceTimeValid = 'default';
  whatToPracticeValid = 'default';
  sessionIntentValid = 'default';
  sessionReflectionValid = 'default';
  goalForNextTimeValid = 'default';
  // TODO: Save this for view when need to display a date in text format
  // today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');

  constructor(private fb: FormBuilder, private router: Router) {
    this.validationStatus = [
      { label: 'invalid', value: FieldValidationStatus.INVALID },
      { label: 'warning', value: FieldValidationStatus.EMPTY },
      { label: 'valid', value: FieldValidationStatus.VALID},
    ]
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.sessionForm = this.fb.group({
      practiceTime: ['', [Validators.required]],
      whatToPractice: ['', [Validators.required]],
      sessionIntent: ['', [Validators.required]],
    });
    this.timerForm = this.fb.group({
      time: [''],
    });
    this.afterForm = this.fb.group({
      sessionReflection:['', [Validators.required]],
      goalForNextTime: ['',[Validators.required]]
    });
    this.practiceTime = this.sessionForm.get('practiceTime');
    this.whatToPractice = this.sessionForm.get('whatToPractice');
    this.sessionIntent = this.sessionForm.get('sessionIntent');
    this.sessionReflection = this.afterForm.get('sessionReflection');
    this.goalForNextTime =this.afterForm.get('goalForNextTime');
    this.onFormChanges();
  }

  startSession(): void {

  }

  setTimer(): void {
    const sessionTime = this.practiceTime.value;
    console.log(`Session time ${sessionTime}, fields valid - practiceTime: ${this.practiceTimeValid} whattopractice: ${this.whatToPracticeValid} sessionIntent: ${this.sessionIntentValid}`)
    this.timerForm.get('time').setValue(sessionTime);
  }

  onSubmit(): void {
    this.router.navigate(['dashboard']).then();
  }

  onFormChanges(): void {
    this.sessionForm.valueChanges.subscribe(value => {
        this.practiceTimeValid = this.checkFieldValidation(this.practiceTime);
        this.whatToPracticeValid = this.checkFieldValidation(this.whatToPractice);
        this.sessionIntentValid = this.checkFieldValidation(this.sessionIntent);
        this.sessionReflectionValid = this.checkFieldValidation(this.sessionReflection);
        this.goalForNextTimeValid = this.checkFieldValidation(this.goalForNextTime);
    });
  }

  checkFieldValidation(control: AbstractControl): string {
    if (control.valid) {
      return this.fieldValidationStatus.VALID;
    }
    if (!control.valid) {
      return this.fieldValidationStatus.INVALID;
    }
    return this.fieldValidationStatus.EMPTY;
  }
}
