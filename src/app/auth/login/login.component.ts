import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, untilDestroyed } from '@core';
import { AuthenticationService } from '../authentication.service';
import { LoginContext, Credentials } from '../user.model';
import { CredentialsService } from '../credentials.service';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  signInForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {
    this.createForm();
  }

  ngOnInit() {
    // REDIRECTION VERS LA PAGE D'ACCUEIL SI L'UTILISATEUR EST DÉJÀ CONNECTÉ
    if(this.credentialsService.isAuthenticated) {
      this.router.navigate([this.route.snapshot.queryParams.redirect || '/home'], { replaceUrl: true });
    }
  }

  ngOnDestroy() {}

  signIn() {
    this.isLoading = true;
    const signInFormValue = this.signInForm.value;
    const loginContext: LoginContext = {email: signInFormValue.name, password: signInFormValue.password};
    const signIn$ = this.authenticationService.signIn(loginContext);

    signIn$
      .pipe(
        finalize(() => {
          this.signInForm.markAsPristine();
          this.isLoading = false;

          // RÉCUPERATION DE L'UTILISATEUR COURANT
          this.authenticationService.getCurrentUser().subscribe(currentUser => {
            this.credentialsService.saveCurrentUser(currentUser);
          }, error => log.error('Impossible de récuperer l\'utilisateur connecté ' + error));
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (accessToken) => {
          /*log.debug(`${credentials.name} successfully logged in`);*/
          const credentials: Credentials = {name: signInFormValue.email, token: accessToken.accessToken}
          this.credentialsService.setCredentials(credentials, signInFormValue.remember);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Login error (email or password is incorrect): ${error}`, error);
          this.error = error;
        }
      );
  }

  private createForm() {
    this.signInForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
}
