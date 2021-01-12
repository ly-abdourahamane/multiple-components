import { Component, OnInit } from '@angular/core';
import { FileService } from '../file/file.service';
import { FileUpload } from '../file/file.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Logger } from '@app/@core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

const logger = new Logger('FileListComponent');

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  fileInfosList: FileUpload[] = [];
  selectedFile: FileUpload;

  constructor(private fileService: FileService, public matDialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fileService.findFilesInfos().subscribe((fileList: FileUpload[]) => {
      this.fileInfosList = fileList;
    });
  }

  downloadFileByID(file: FileUpload ) {
    this.fileService.downloadFileByID(file.id).subscribe(response => {
      const blob: Blob = response.body

      const elementA = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      elementA.href = objectUrl
      elementA.download = file.name;
      elementA.click();
      URL.revokeObjectURL(objectUrl);
    })
  }

  deleteFileByID(file: FileUpload) {
    this.fileService.deleteFileByID(file.id).subscribe(response => {
      const index = this.fileInfosList.findIndex(item => item.id === file.id);
      this.fileInfosList.splice(index, 1);
      this.openSnackBar(file.name);
    });
  }

  openSnackBar(fileName: string) {
    const config = new MatSnackBarConfig();
    config.duration = 2000;
    config.panelClass = ['red-snackbar'];
    config.direction = 'ltr';
    config.horizontalPosition =  'center';
    config.verticalPosition = 'bottom';
    this._snackBar.open('Vous avez supprimé '+fileName, 'OK', config);
    logger.info('Le fichier '+ fileName+ ' est supprimé');
  }

  openConfirmDeleteFileDialog(file: FileUpload): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
   // dialogConfig.width = '250px'

    const dialogRef = this.matDialog.open(ConfirmDeleteFileDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response: string) => {
      if(response === 'ok') {
        this.deleteFileByID(file);
      }
    });
  }

}

@Component({
  selector: 'confirm-delete-file-dialog',
  template: `<h5 mat-dialog-title>Voulez vous confirmer ?</h5>
  <div mat-dialog-content>

  </div>
  <div mat-dialog-actions align="center">
    <button mat-button (click)="onCancelDeleteFile()">Non</button>
    <button mat-button (click)="onConfirmDeleteFile()" cdkFocusInitial>Oui</button>
  </div>`
})
export class ConfirmDeleteFileDialogComponent {

  constructor(private dialogRef: MatDialogRef<ConfirmDeleteFileDialogComponent>) {}

    onCancelDeleteFile(): void {
    this.dialogRef.close();
  }

  onConfirmDeleteFile() {
    this.dialogRef.close('ok');
  }

}
