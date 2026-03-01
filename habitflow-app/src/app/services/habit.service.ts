import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Habit data model — reflects the planned Firestore document structure
export interface Habit {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  // How often the habit should be completed: 'daily' | 'weekly'
  frequency: 'daily' | 'weekly';
  currentStreak: number;
  longestStreak: number;
  // ISO date string (YYYY-MM-DD) of the last day this habit was completed
  lastCompletedDate: string | null;
  // Array of ISO date strings when the habit was marked complete
  completionHistory: string[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  constructor() {}

  /**
   * Returns a real-time observable of all habits for the given user.
   * TODO: Replace with Firestore collectionData query scoped to userId.
   */
  getHabits(userId: string): Observable<Habit[]> {
    // Placeholder — returns empty array until Firestore is wired up
    return of([]);
  }

  /**
   * Creates a new habit document in Firestore.
   * TODO: Replace with Firestore addDoc / setDoc.
   */
  async createHabit(habit: Omit<Habit, 'id'>): Promise<void> {
    throw new Error('createHabit() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Updates an existing habit document.
   * Uses a Firestore transaction to update streak fields atomically.
   * TODO: Replace with Firestore updateDoc.
   */
  async updateHabit(habitId: string, changes: Partial<Habit>): Promise<void> {
    throw new Error('updateHabit() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Deletes a habit document and all its completion records.
   * TODO: Replace with Firestore deleteDoc.
   */
  async deleteHabit(habitId: string): Promise<void> {
    throw new Error('deleteHabit() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Marks today as complete for the given habit and recalculates the streak.
   * This is a separate helper to encapsulate streak logic cleanly.
   * TODO: Implement with a Firestore transaction once Firebase is configured.
   */
  async completeHabitToday(habit: Habit): Promise<void> {
    throw new Error('completeHabitToday() not yet implemented — awaiting Firebase configuration');
  }
}
