import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, deleteDoc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';
import { catchError, from, map, Observable, of, throwError } from 'rxjs';

// Define a type for your task for better type safety
interface TaskItem {
  id?: string; // ID is optional when adding, but present when fetched
  title: string;
  description: string;
  createdAt?: Date; // Optional, set by the backend
}

@Injectable({
  providedIn: 'root'
})
export class Task {

  public auth = inject(Auth);
  private firestore = inject(Firestore);

  addTask(task: { title: string, description: string }): Observable<any> {
    const user = this.auth.currentUser;
    if (user) {
      const taskRef = collection(this.firestore, `users/${user.uid}/tasks`)
      return from(addDoc(taskRef, { ...task, createdAt: new Date() })).pipe(
        map(docRef => ({ id: docRef.id, ...task })),
        catchError( error => throwError( ()=> new Error('Failed to add task.')))
      )
     // return await addDoc(taskRef, { ...tasks, createdAt: new Date() });
    } else {
      return throwError(() => new Error('User not authenticated. Please log in to add tasks.'));
    }
  }

  getTasks(): Observable<TaskItem[]> {
    const user = this.auth.currentUser;
    if (user) {
      const taskRef = collection(this.firestore, `users/${user.uid}/tasks`);
      // Use 'from' to convert the getDocs Promise into an Observable
      return from(getDocs(taskRef)).pipe(
        map(querySnapshot => querySnapshot.docs.map( doc => ({ id: doc.id, ...doc.data() as TaskItem}))),
        catchError(error => {return throwError(() => new Error('Failed to retrieve tasks.'));})
      )
    } else {
      return of([]);
    }
  }

  updateTask(taskId: string, update:{title?: string, description?:string}): Observable<void> {
    const user = this.auth.currentUser;
    if (user && taskId) {
      const taskRef = doc(this.firestore, `users/${user.uid}/tasks/${taskId}`)
      return from(updateDoc(taskRef, update)).pipe(
        catchError(() => throwError(() => new Error('Failed to update task.')))
      )
    } else {
      return throwError(() => new Error('User not authenticated or invalid task ID.'));
    }
  }

  deleteTask(taskId:string): Observable<void> {
    const user = this.auth.currentUser;
    if (user && taskId) {
      const taskRef = doc(this.firestore, `users/${user.uid}/tasks/${taskId}`)
      return from(deleteDoc(taskRef)).pipe(
        catchError( () => throwError(() => new Error('Failed to delete task.')))
      )
    } else {
      return throwError(() => new Error('User not authenticated or invalid task ID.'));
    }
  }
}
