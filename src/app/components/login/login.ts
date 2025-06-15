import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [FormsModule, CommonModule],
})
export class Login {
private authService = inject(AuthService);
private router = inject(Router);

email = signal('');
password = signal('');
error = signal('');

login() {
  this.authService.login(this.email(), this.password()).pipe( take(1)).subscribe({
    next: () => this.router.navigate(['/task']),
    error: error => this.error.set(error.message)
  })
}

loginWithGoogle() {
  this.authService.loginWithGoogle().pipe(take(1)).subscribe({
    next: () => this.router.navigate(['/task']),
    error: err => this.error.set(err.message)
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
