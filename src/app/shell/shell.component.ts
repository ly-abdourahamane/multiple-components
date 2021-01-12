import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { User } from '@app/auth/user.model';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {



  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private media: MediaObserver
  ) {}

  ngOnInit() {

  }

  logout() {
    this.authenticationService.logout().subscribe((result) => {
      this.credentialsService.setCredentials();
      this.router.navigate(['/login'], { replaceUrl: true })
   });
  }

  get name(): string  {
    const user: User = this.credentialsService.getCurrentUser();
    let name = '';

    if(user !== null && user !== undefined) {
      name = user.name;
    }

    return name;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
