import { Component, OnInit } from "@angular/core";
import { Session } from "../../models/session";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FieldValidationStatus, Option } from "../../models/formHelpers";
import { SessionService } from "../../services/session.service";
import { fromEvent, interval, Subscription } from "rxjs";

enum SessionStatus {
  Before = "before",
  During = "during",
  After = "after"
}
@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"]
})
export class SessionComponent implements OnInit {
  session: Session = {
    practiceTime: 0,
    whatToPractice: "",
    sessionIntent: "",
    postPracticeReflection: "",
    goalForNextTime: "",
    id: "",
    date: Date()
  };
  validationStatus: Option[];
  sessionStatus: SessionStatus = SessionStatus.Before;
  fieldValidationStatus = FieldValidationStatus;
  targetPracticeTime = 0;
  timeElapsed = 0;
  sessionForm: FormGroup;
  timerForm: FormGroup;
  afterForm: FormGroup;
  practiceTime: AbstractControl;
  whatToPractice: AbstractControl;
  sessionIntent: AbstractControl;
  sessionReflection: AbstractControl;
  goalForNextTime: AbstractControl;
  practiceTimeValid = "default";
  whatToPracticeValid = "default";
  sessionIntentValid = "default";
  sessionReflectionValid = "default";
  goalForNextTimeValid = "default";
  startButton = document.querySelector("#startButton");
  stopButton = document.querySelector("#endButton");
  startClick$ = fromEvent(this.startButton, "click");
  stopClick$ = fromEvent(this.stopButton, "click");
  time: string = '00:00:00';
  timerSubscription: Subscription;
  startTime: number;
  elapsedTime: number = 0;
  resourcesAdded: boolean;

  constructor(
    private fb: FormBuilder, private router: Router, private sessionService: SessionService
  ) {
    this.validationStatus = [
      { label: "invalid", value: FieldValidationStatus.INVALID },
      { label: "warning", value: FieldValidationStatus.EMPTY },
      { label: "valid", value: FieldValidationStatus.VALID }
    ];
  }

  ngOnInit(): void {
    this.recordSessionActualTime(0);
    this.initializeForm();
    this.subscribeToFormChanges();
  }

  initializeForm(): void {
    this.sessionForm = this.fb.group({
      practiceTime: ["", [Validators.required]],
      whatToPractice: ["", [Validators.required]],
      sessionIntent: ["", [Validators.required]]
    });
    this.afterForm = this.fb.group({
      sessionReflection: ["", [Validators.required]],
      goalForNextTime: ["", [Validators.required]]
    });
    this.practiceTime = this.sessionForm.get("practiceTime");
    this.whatToPractice = this.sessionForm.get("whatToPractice");
    this.sessionIntent = this.sessionForm.get("sessionIntent");
    this.sessionReflection = this.afterForm.get("sessionReflection");
    this.goalForNextTime = this.afterForm.get("goalForNextTime");
  }

  subscribeToFormChanges(): void {
    this.sessionForm.valueChanges.subscribe(value => {
      this.practiceTimeValid = this.checkFieldValidation(this.practiceTime);
      this.whatToPracticeValid = this.checkFieldValidation(this.whatToPractice);
      this.sessionIntentValid = this.checkFieldValidation(this.sessionIntent);
    });
    this.afterForm.valueChanges.subscribe(value => {
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

  onSubmit(): void {
    this.session.whatToPractice = this.sessionForm.get("whatToPractice").value;
    this.session.sessionIntent = this.sessionIntent.value;
    this.session.postPracticeReflection = this.sessionReflection.value;
    this.session.goalForNextTime = this.goalForNextTime.value;
    this.sessionService.putSession$(this.session);
    this.router.navigate(["dashboard"]).then();
  }

  // function to take the value from the session-timer and record it as the practice time in the session object
  recordSessionActualTime(actualTime: number): void {
    this.session.practiceTime = Math.trunc(actualTime);
  }

  //Timer functions

  startTimer() {
      this.startTime = Date.now() - this.elapsedTime;
      this.timerSubscription = interval(1000).subscribe(() => {
        this.elapsedTime = Date.now() - this.startTime;
        this.time = this.formatTime(this.elapsedTime);
      });
      this.sessionStatus = SessionStatus.During;
    }

  stopTimer() {
      this.timerSubscription.unsubscribe();
      this.session.practiceTime = this.elapsedTime;
      this.sessionStatus = SessionStatus.After;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  padNumber(number: number): string {
    return number.toString().padStart(2, '0');
  }

  addResourcesToSession() {
    this.resourcesAdded = true;
    //openModal resourcePicker
  }
}
