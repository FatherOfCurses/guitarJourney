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
    id: "6badcbb7-afbf-4e28-8fdd-b6e068a493c1",
    date: Date()
  };
  validationStatus: Option[];
  sessionStatus: SessionStatus = SessionStatus.Before;
  fieldValidationStatus = FieldValidationStatus;
  targetPracticeTime = 0;
  timeElapsed = 0;
  prePracticeForm: FormGroup;
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
    this.initializeForm();
    this.subscribeToFormChanges();
  }

  initializeForm(): void {
    this.prePracticeForm = this.fb.group({
      practiceTime: ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
      whatToPractice: ["", Validators.required],
      sessionIntent: ["", Validators.required]
    });
    this.afterForm = this.fb.group({
      sessionReflection: ["", [Validators.required]],
      goalForNextTime: ["", [Validators.required]]
    });
    this.practiceTime = this.prePracticeForm.get("practiceTime");
    this.whatToPractice = this.prePracticeForm.get("whatToPractice");
    this.sessionIntent = this.prePracticeForm.get("sessionIntent");
    this.sessionReflection = this.afterForm.get("sessionReflection");
    this.goalForNextTime = this.afterForm.get("goalForNextTime");
  }

  subscribeToFormChanges(): void {
    this.prePracticeForm.valueChanges.subscribe(value => {
      this.practiceTimeValid = this.checkFieldValidation(this.practiceTime);
      this.whatToPracticeValid = this.checkFieldValidation(this.whatToPractice);
      this.sessionIntentValid = this.checkFieldValidation(this.sessionIntent);
    });
    this.afterForm.valueChanges.subscribe(value => {
      this.sessionReflectionValid = this.checkFieldValidation(this.sessionReflection);
      this.goalForNextTimeValid = this.checkFieldValidation(this.goalForNextTime);
    });
  }

  checkFieldValidation(control: AbstractControl): FieldValidationStatus {
    if (control.valid) {
      return this.fieldValidationStatus.VALID;
    }
    if (!control.valid) {
      return this.fieldValidationStatus.INVALID;
    }
  }

  onSubmit(): void {
    this.session.whatToPractice = this.prePracticeForm.get("whatToPractice").value;
    this.session.sessionIntent = this.prePracticeForm.get("sessionIntent").value;
    this.session.postPracticeReflection = this.afterForm.get("sessionReflection").value;
    this.session.goalForNextTime = this.afterForm.get("goalForNextTime").value;
    this.sessionService.putSession$(this.session);
    this.router.navigate(['/']);
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
