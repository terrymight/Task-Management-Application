import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../services/authService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrl:'./signup.css',
  imports: [FormsModule,CommonModule],
})
export class Signup {
  private signupService = inject(AuthService);
  private router = inject(Router)

  email = signal('');
  password = signal('');
  error = signal('');

   onSubmit() {
    this.signupService.register(this.email(), this.password()).pipe(take(1)).subscribe({
      next: () => this.router.navigate(['/login']),
      error: error => this.error.set(error)
    })
   }

onPasswordInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  this.password.set(inputElement.value);
}

onEmailInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  this.email.set(inputElement.value);
}
}
