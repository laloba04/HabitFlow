import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Supported expense categories
export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'bills'
  | 'other';

// Expense data model — reflects the planned Firestore document structure
export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  // ISO date string (YYYY-MM-DD) of when the expense occurred
  date: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor() {}

  /**
   * Returns a real-time observable of all expenses for the given user.
   * Optionally filtered by month (format: YYYY-MM).
   * TODO: Replace with Firestore collectionData query scoped to userId.
   */
  getExpenses(userId: string, month?: string): Observable<Expense[]> {
    // Placeholder — returns empty array until Firestore is wired up
    return of([]);
  }

  /**
   * Creates a new expense document in Firestore.
   * TODO: Replace with Firestore addDoc.
   */
  async createExpense(expense: Omit<Expense, 'id'>): Promise<void> {
    throw new Error('createExpense() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Updates an existing expense document.
   * TODO: Replace with Firestore updateDoc.
   */
  async updateExpense(expenseId: string, changes: Partial<Expense>): Promise<void> {
    throw new Error('updateExpense() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Deletes an expense document.
   * TODO: Replace with Firestore deleteDoc.
   */
  async deleteExpense(expenseId: string): Promise<void> {
    throw new Error('deleteExpense() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Returns the total amount spent in a given month (YYYY-MM).
   * TODO: Implement using aggregation over Firestore data.
   */
  getMonthlyTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * Groups expenses by category and returns summed totals per category.
   * Used by the dashboard chart.
   */
  getCategoryBreakdown(expenses: Expense[]): Record<ExpenseCategory, number> {
    const breakdown: Partial<Record<ExpenseCategory, number>> = {};
    for (const expense of expenses) {
      breakdown[expense.category] = (breakdown[expense.category] ?? 0) + expense.amount;
    }
    return breakdown as Record<ExpenseCategory, number>;
  }
}
