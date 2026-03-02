import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Habit {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  completionHistory: string[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  constructor() {}

  // TODO: conectar con Firestore
  getHabits(userId: string): Observable<Habit[]> {
    return of([]);
  }

  async createHabit(habit: Omit<Habit, 'id'>): Promise<void> {
    throw new Error('pendiente de implementar');
  }

  async updateHabit(habitId: string, changes: Partial<Habit>): Promise<void> {
    throw new Error('pendiente de implementar');
  }

  async deleteHabit(habitId: string): Promise<void> {
    throw new Error('pendiente de implementar');
  }

  async completeHabitToday(habit: Habit): Promise<void> {
    throw new Error('pendiente de implementar');
  }
}
