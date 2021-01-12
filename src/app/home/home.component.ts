import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { AuthenticationService } from '@app/auth';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import {FileUploader} from 'ng2-file-upload';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }
}
