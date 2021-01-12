import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private httpClient: HttpClient) {}

  getRandomQuote(context: RandomQuoteContext): Observable<string> {
    return this.httpClient.get(routes.quote(context)).pipe(
      map((body: any) => body.value),
      catchError(() => of('Error, could not load joke :-('))
    );
  }

   // file from event.target.files[0]
   uploadFile(file: File): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append('file', file);

    const header = new HttpHeaders();
    header.append('Content-Type','application/json');
    header.append('Content-Type','multipart/form-data');
    header.append('enctype','multipart/form-data');

    const httpOptions = {
      headers: header
    };

    formData.forEach(x => console.log(x));

    const param = new HttpParams();

    const options = {
      params: param,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', `files/upload/one`, formData, httpOptions);

    return this.httpClient.request(req);
  }

  uploadFiles(formData: FormData): Observable<any> {
    const header = new HttpHeaders();
    header.append('Content-Type','application/json');
    header.append('Content-Type','multipart/form-data');
    header.append('enctype','multipart/form-data');

    const httpOptions1 = {
      headers: header
    };

    const httpOptions = {
      headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      })
    };

    return this.httpClient.post('files/upload/multiple', formData, httpOptions);
  }

  downloadFile(name: string): Observable<Blob> {
    return this.httpClient.get(`files/download/${name}`, { responseType: 'blob' });
  }
}
