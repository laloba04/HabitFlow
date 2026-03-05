import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService, AppUser } from '../../services/auth.service';
import { HabitService, Habit } from '../../services/habit.service';
import { ExpenseService, Expense } from '../../services/expense.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, OnDestroy {

  currentUser: AppUser | null = null;
  readonly today = new Date();

  // Stats calculadas
  totalHabits = 0;
  completedToday = 0;
  longestStreak = 0;
  monthlyExpenses = 0;

  private dataSub?: Subscription;

  constructor(
    private authService: AuthService,
    private habitService: HabitService,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const user = this.currentUser;
    if (!user) return;

    // Suscripción combinada a hábitos y gastos en tiempo real
    this.dataSub = combineLatest([
      this.habitService.getHabits(user.uid),
      this.expenseService.getExpenses(user.uid)
    ]).subscribe(([habits, expenses]) => {
      this.calcHabitStats(habits);
      this.calcMonthlyExpenses(expenses);
    });
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }

  // Calcula totales de hábitos y racha máxima
  private calcHabitStats(habits: Habit[]): void {
    this.totalHabits = habits.length;
    this.completedToday = habits.filter(h => this.habitService.isCompletedToday(h)).length;
    this.longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  }

  // Suma los gastos del mes en curso
  private calcMonthlyExpenses(expenses: Expense[]): void {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1; // 1-12

    const monthlyPrefix = `${thisYear}-${String(thisMonth).padStart(2, '0')}`;
    const thisMonth$ = expenses.filter(e => e.date.startsWith(monthlyPrefix));
    this.monthlyExpenses = this.expenseService.getMonthlyTotal(thisMonth$);
  }

  get displayName(): string {
    return this.currentUser?.displayName?.split(' ')[0] ?? 'usuario';
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  irAHabitos(): void {
    this.router.navigateByUrl('/tabs/habits');
  }

  irAGastos(): void {
    this.router.navigateByUrl('/tabs/expenses');
  }
}
