import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'bills'
  | 'other';

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;       // YYYY-MM-DD
  createdAt: string;  // ISO
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private firestore: Firestore) {}

  // Devuelve los gastos del usuario en tiempo real, ordenados por fecha descendente
  getExpenses(userId: string): Observable<Expense[]> {
    const ref = collection(this.firestore, 'expenses');
    const q = query(
      ref,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Expense[]>;
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<void> {
    const ref = collection(this.firestore, 'expenses');
    await addDoc(ref, expense);
  }

  async deleteExpense(expenseId: string): Promise<void> {
    const ref = doc(this.firestore, 'expenses', expenseId);
    await deleteDoc(ref);
  }

  // Suma total de un array de gastos (ya filtrado por mes en el componente)
  getMonthlyTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  // Totales por categoría
  getCategoryBreakdown(expenses: Expense[]): Record<ExpenseCategory, number> {
    const breakdown: Partial<Record<ExpenseCategory, number>> = {};
    for (const expense of expenses) {
      breakdown[expense.category] = (breakdown[expense.category] ?? 0) + expense.amount;
    }
    return breakdown as Record<ExpenseCategory, number>;
  }
}
