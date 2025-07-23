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
  validationErrors?: string[];

  registerForm = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snack.open('Registration successful', 'Close', { duration: 3000 });
        this.router.navigateByUrl('/account/login');
      },
      error: err => {
        console.log('API Error:', err);
        console.log('Error Object:', err.error);
        
        let errors: string[] = [];
        
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              errors.push(...value);
            } else {
              errors.push(value as string);
            }
          });
        } else if (err.error && typeof err.error === 'object') {
          if (err.error.title) {
            errors.push(err.error.title);
          }
          if (err.error.message) {
            errors.push(err.error.message);
          }
        } else if (typeof err.error === 'string') {
          errors.push(err.error);
        } else {
          errors.push('Bir hata oluştu');
        }
                console.log('Final Errors:', errors);
        this.validationErrors = errors;
      },
    });
  }
}
