import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/accountService';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  returnUrl = '/';

  validationErrors: string[] | null = null;

  constructor() {
    const urtl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    if (urtl) {
      this.returnUrl = urtl;
    }
  }

  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe();
        this.router.navigateByUrl(this.returnUrl);
      },
      error: error => {
        let errors: string[] = [];
        const payload = Array.isArray(error) ? error : (error?.error ?? error);

        if (Array.isArray(payload)) {
          errors = payload;
        } else if (Array.isArray(payload?.errors)) {
          errors = payload.errors;
        } else if (payload?.message) {
          errors.push(payload.message);
        } else if (typeof payload === 'string') {
          errors.push(payload);
        } else {
          errors.push('Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
        }
        this.validationErrors = errors;
      }
    });
  }
}
