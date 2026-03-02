import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from '@angular/fire/firestore';

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

  constructor(private firestore: Firestore) {}

  // Devuelve los hábitos del usuario en tiempo real
  getHabits(userId: string): Observable<Habit[]> {
    const habitsRef = collection(this.firestore, 'habits');
    const habitsQuery = query(habitsRef, where('userId', '==', userId));
    return collectionData(habitsQuery, { idField: 'id' }) as Observable<Habit[]>;
  }

  async createHabit(habit: Omit<Habit, 'id'>): Promise<void> {
    const habitsRef = collection(this.firestore, 'habits');
    await addDoc(habitsRef, habit);
  }

  async updateHabit(habitId: string, changes: Partial<Habit>): Promise<void> {
    const habitDoc = doc(this.firestore, 'habits', habitId);
    await updateDoc(habitDoc, changes);
  }

  async deleteHabit(habitId: string): Promise<void> {
    const habitDoc = doc(this.firestore, 'habits', habitId);
    await deleteDoc(habitDoc);
  }

  // Marca el hábito como completado hoy y recalcula la racha
  async completeHabitToday(habit: Habit): Promise<void> {
    const today = this.getTodayString();

    // Evitar doble registro si ya se completó hoy
    if (habit.completionHistory.includes(today)) {
      return;
    }

    const yesterday = this.getYesterdayString();
    const completedYesterday = habit.lastCompletedDate === yesterday;

    // Si ayer también se completó, se incrementa la racha; si no, empieza en 1
    const newStreak = completedYesterday ? habit.currentStreak + 1 : 1;
    const newLongestStreak = newStreak > habit.longestStreak ? newStreak : habit.longestStreak;

    const changes: Partial<Habit> = {
      lastCompletedDate: today,
      completionHistory: [...habit.completionHistory, today],
      currentStreak: newStreak,
      longestStreak: newLongestStreak
    };

    await this.updateHabit(habit.id!, changes);
  }

  // Devuelve la fecha de hoy en formato YYYY-MM-DD
  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Devuelve la fecha de ayer en formato YYYY-MM-DD
  private getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // Comprueba si el hábito ya fue completado hoy
  isCompletedToday(habit: Habit): boolean {
    return habit.completionHistory.includes(this.getTodayString());
  }
}
