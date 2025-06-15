import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from "../../services/task";
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { catchError, of, single, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  imports: [CommonModule, FormsModule],
})
export class Tasks implements OnInit{

  protected tasks: WritableSignal<any[]> = signal([]);
  newTaskTitle: WritableSignal<string> = signal('')
  newTaskDescription: WritableSignal<string> = signal('')
  user: WritableSignal<any | null> = signal(null);
  error = signal('')

  // Injected Service
  private taskService = inject(Task);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.authService.user$.pipe(
      tap(user => {
        this.user.set(user); // Update the user signal
        if (user) {
          this.loadTasks(); // Load tasks if user is authenticated
        } else {
          this.tasks.set([]); // Clear tasks if no user
          this.router.navigate(['/login']); // Redirect to login if not authenticated
        }
      }),
      takeUntilDestroyed(this.destroyRef) // Automatically unsubscribe when component is destroyed
    ).subscribe();
  }

  loadTasks(): void {
    this.taskService.getTasks().pipe(
      tap(tasks => {
        this.tasks.set(tasks); // Update the tasks signal
        this.error.set(''); // Clear any previous error on success
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  addTask():void {
    const title = this.newTaskTitle().trim();
    const description = this.newTaskDescription().trim();

    if (title && description) {
      this.taskService.addTask({title, description}).pipe(
        tap(() => {
          this.loadTasks();
          this.newTaskTitle.set('')
          this.newTaskDescription.set('')
          this.error.set('')
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
    } else {
      this.error.set('Both title and description are required.');
    }
  }

  deleteTask(taskId:string):void {
    this.taskService.deleteTask(taskId).pipe(
      tap(() => {
        this.loadTasks();
        this.error.set('');
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  onLogout(): void {
    this.authService.logout().pipe(
      catchError( err => {
        this.error.set(`Logout failed: ${err.message} || 'Unknown error'`);
        return of(null)
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  onInput(event: Event, targetSignal: WritableSignal<string>): void {
    const inputElement = event.target as HTMLInputElement; // Type assertion for TypeScript safety
    targetSignal.set(inputElement.value); // Update the signal's value
  }
}
