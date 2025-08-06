import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-error',
  imports: [
    MatButton
  ],
  templateUrl: './test-error.html',
  styleUrl: './test-error.scss'
})
export class TestError {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  validationErrors?: string[];


  get404Error() {
    this.http.get(this.baseUrl + 'error/notfound').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

    get400Error() {
    this.http.get(this.baseUrl + 'error/badrequest').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

    get500Error() {
    this.http.get(this.baseUrl + 'error/internalerror').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }

    get401Error() {
    this.http.get(this.baseUrl + 'error/unauthorized').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    });
  }
    get400ValidationError() {
    this.http.post(this.baseUrl + 'error/validationerror', {}).subscribe({
      next: response => console.log(response),
      error: error => this.validationErrors = error
    });
  }

}
