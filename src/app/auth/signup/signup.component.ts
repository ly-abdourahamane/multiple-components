import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, untilDestroyed } from '@core';
import { AuthenticationService } from '../authentication.service';
import { CredentialsService } from '../credentials.service';

const log = new Logger('Login');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  signupForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {
    this.createSignupForm();
  }

  ngOnInit() {
    if(this.credentialsService.isAuthenticated()) {
      this.router.navigate([this.route.snapshot.queryParams.redirect || '/home'], { replaceUrl: true });
    }
  }

  ngOnDestroy() {}

  signUp() {
    this.isLoading = true;
    const signup$ = this.authenticationService.signUp(this.signupForm.value);

    signup$
      .pipe(
        finalize(() => {
          this.signupForm.markAsPristine();
          this.isLoading = false;
          this.signupForm.reset();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (result) => {
          log.debug(`successfully sign up`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Signup error: ${error}`);
          this.error = error;
        }
      );
  }

  private createSignupForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}

