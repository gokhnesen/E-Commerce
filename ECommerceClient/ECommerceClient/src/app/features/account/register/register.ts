import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../../core/services/accountService';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/components/text-input/text-input";

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatButton,
    MatLabel,
    MatInput,
    JsonPipe,
    MatError,
    TextInput
],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  validationErrors: string[] | null = null;

  registerForm = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.accountService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.snack.open('Registration successful', 'Close', { duration: 3000 });
        this.router.navigateByUrl('/account/login');
      },
      error: (err) => {
        console.log('Register error:', err);

        let errors: string[] = [];
        const payload = Array.isArray(err) ? err : (err?.error ?? err);

        if (Array.isArray(payload)) {
          errors = payload;
        } else if (Array.isArray(payload?.errors)) {
          errors = payload.errors;
        } else if (payload?.errors && typeof payload.errors === 'object') {
          Object.values(payload.errors).forEach(val => {
            if (Array.isArray(val)) errors.push(...val);
            else errors.push(String(val));
          });
        } else if (payload?.message) {
          errors.push(payload.message);
        } else if (typeof payload === 'string') {
          errors.push(payload);
        } else {
          errors.push('Bir hata oluştu');
        }

        const translate = (msg: string) => {
          if (!msg) return msg;
          // yaygın kurallar / kalıp eşleşmeleri
          if (/non[\s-]*alphanumeric|special character/i.test(msg)) return 'Parola en az bir özel karakter içermelidir.';
          if (/digit|0'-'9'|0-9/i.test(msg)) return 'Parola en az bir rakam (0-9) içermelidir.';
          if (/uppercase|'A'-'Z'|büyük harf/i.test(msg)) return 'Parola en az bir büyük harf (A-Z) içermelidir.';
          if (/lowercase|'a'-'z'|küçük harf/i.test(msg)) return 'Parola en az bir küçük harf (a-z) içermelidir.';
          if (/minimum length|min length|length/i.test(msg)) return 'Parola uzunluğu yetersiz.';
          // doğrudan eşlemeler (fallback)
          return msg
            .replace(/Passwords must have at least one non alphanumeric character\./i, 'Parola en az bir özel karakter içermelidir.')
            .replace(/Passwords must have at least one digit \('0'-'9'\)\./i, 'Parola en az bir rakam (0-9) içermelidir.')
            .replace(/Passwords must have at least one uppercase \('A'-'Z'\)\./i, 'Parola en az bir büyük harf (A-Z) içermelidir.');
        };

        this.validationErrors = errors.map(e => translate(String(e)));
      },
    });
  }
}
