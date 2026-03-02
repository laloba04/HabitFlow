import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  date: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor() {}

  // TODO: conectar con Firestore
  getExpenses(userId: string, month?: string): Observable<Expense[]> {
    return of([]);
  }

  async createExpense(expense: Omit<Expense, 'id'>): Promise<void> {
    throw new Error('pendiente de implementar');
  }

  async updateExpense(expenseId: string, changes: Partial<Expense>): Promise<void> {
    throw new Error('pendiente de implementar');
  }

  async deleteExpense(expenseId: string): Promise<void> {
    throw new Error('pendiente de implementar');
  }

  getMonthlyTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  getCategoryBreakdown(expenses: Expense[]): Record<ExpenseCategory, number> {
    const breakdown: Partial<Record<ExpenseCategory, number>> = {};
    for (const expense of expenses) {
      breakdown[expense.category] = (breakdown[expense.category] ?? 0) + expense.amount;
    }
    return breakdown as Record<ExpenseCategory, number>;
  }
}
