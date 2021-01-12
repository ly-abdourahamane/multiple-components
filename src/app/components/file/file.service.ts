import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileUpload } from './file.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) {}

   uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    const header = { 'Content-Type': 'multipart/form-data' }

    const httpOptions = {
      headers: header
    };

    return this.httpClient.post<HttpEvent<any>>(`files/upload/one`, file, httpOptions);
  }

  downloadFileByName(name: string): Observable<Blob> {
    return this.httpClient.get(`files/download/${name}`, { responseType: 'blob' });
  }

  downloadFileByID(id: number) {
    return this.httpClient.get(`files/download/v2/${id}`,
     {responseType: 'blob', reportProgress: true, observe: 'response' });
  }

  findFilesInfos(): Observable<FileUpload[]> {
    return this.httpClient.get<FileUpload[]>(`files/all/infos`, httpOptions);
  }

  deleteFileByID(id: number) {
    return this.httpClient.get(`files/delete/${id}`);
  }
}
