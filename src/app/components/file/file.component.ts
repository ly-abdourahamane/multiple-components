import { Component, OnInit, EventEmitter } from '@angular/core';

import { AuthenticationService } from '@app/auth';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import {FileUploader} from 'ng2-file-upload';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FileService } from './file.service';

const URL = 'http://localhost:80100/api/v1/utils/files/upload/one';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;

  pdfSrc = 'assets/Spring.pdf';

  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response:string;
  uploader:FileUploader

  uploadForm: FormGroup;

  public uploaders: FileUploader = new FileUploader({
    disableMultipart : false,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf']


    });

  constructor(private filseService: FileService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder) {
     // this.uploader.response.subscribe((result: any) => console.log(result) );

      this.uploader = new FileUploader({
        isHTML5: true,
        url: URL,
        method: 'post',
        disableMultipart: true,
        formatDataFunctionIsAsync: true,
        itemAlias: 'attachment',
        autoUpload: true,
        allowedFileType: ['image', 'pdf', 'txt', 'csv'],

        formatDataFunction: async (item: any) => {
          return new Promise( (resolve, reject) => {
            resolve({
              name: item._file.name,
              length: item._file.size,
              contentType: item._file.type,
              date: new Date()
            });
          });
        }
      });

      this.hasBaseDropZoneOver = false;
      this.hasAnotherDropZoneOver = false;

      this.response = '';

      this.uploader.response.subscribe((res:any) => {
        console.log(res);
        this.response = res
      });
    }

  ngOnInit() {
    this.isLoading = false;
    this.quote = 'home';

    this.filseService.downloadFileByName('conflit.png').subscribe(x => console.log(x));
    this.uploadForm = this.formBuilder.group({
      document: [null, null],
      type:  [null, Validators.compose([Validators.required])]
    });
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    this.uploadFile(event.dataTransfer.files);
  }

  // At the drag drop area
  // (dragover)="onDragOverFile($event)"
  onDragOverFile(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  // At the file input element
  // (change)="selectFile($event)"
  selectFile(event: any) {
    this.uploadFile(event.target.files);
  }

  uploadFile(event: any) {
    const files: FileList = event.target.files;

    if (files.length === 0) {
      console.log('No file selected!');
      return
    }

    console.log(files);

    const file: File = files[0];

    console.log(file);
    console.log('upload file ...');

    this.filseService.uploadFile(file)
      .subscribe((result: any) => {
        console.log(result);
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely loaded!');
          }
        },
        (err: any) => {
          console.log('Upload Error:', err);
        }, () => {
          console.log('Upload done');
        }
      )
  }

  uploadSubmit(){
    for (const elem of this.uploader.queue) {
      const fileItem = elem._file;
      if(fileItem.size > 10000000){
        alert('Each File should be less than 10 MB of size.');
        return;
      }
    }

    for (let j = 0; j < this.uploader.queue.length; j++) {
      const fileItem = this.uploader.queue[j]._file;
      this.filseService.uploadFile(fileItem).subscribe();
    }

    this.uploader.clearQueue();
  }

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    this.filseService.uploadFile(file).subscribe(r => console.log(r))
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
}
