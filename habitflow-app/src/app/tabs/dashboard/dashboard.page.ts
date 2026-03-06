import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';

import { AuthService, AppUser } from '../../services/auth.service';
import { HabitService, Habit } from '../../services/habit.service';
import { ExpenseService, Expense, ExpenseCategory } from '../../services/expense.service';

// Colores hex directos para Chart.js (no puede leer CSS custom properties)
const COLORS = {
  accent:      '#6366F1',
  accentDark:  '#818CF8',
  surface2:    '#F5F7FF',
  surface2Dark:'#1A1B35',
  accent2:     '#06B6D4',
  accent3:     '#10B981',
} as const;

// Mapa de colores por categoría de gasto
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food:          '#F59E0B',
  transport:     '#3B82F6',
  entertainment: '#8B5CF6',
  health:        '#10B981',
  shopping:      '#EC4899',
  bills:         '#6366F1',
  other:         '#6B7280',
};

// Etiquetas legibles de categoría en español
const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food:          'Comida',
  transport:     'Transporte',
  entertainment: 'Ocio',
  health:        'Salud',
  shopping:      'Compras',
  bills:         'Facturas',
  other:         'Otros',
};

// Nombres cortos de día de la semana en español
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, OnDestroy {

  currentUser: AppUser | null = null;
  readonly today = new Date();

  // Stats simples
  totalHabits = 0;
  completedToday = 0;
  longestStreak = 0;
  monthlyExpenses = 0;

  // Control de visibilidad del donut de gastos
  hasExpenses = false;

  // ── Chart: donut de progreso diario ────────────────────────────
  progressChartData: ChartData<'doughnut'> = {
    labels: ['Completados', 'Pendientes'],
    datasets: [{
      data: [0, 1],
      backgroundColor: [COLORS.accent, COLORS.surface2],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  progressChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
        },
      },
    },
    animation: { duration: 600 },
  };

  // ── Chart: barras de los últimos 7 días ────────────────────────
  weeklyChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Hábitos completados',
      data: [],
      backgroundColor: 'rgba(99, 102, 241, 0.75)',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  weeklyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => `${items[0].label}`,
          label: (ctx) => ` ${ctx.parsed.y} hábito${ctx.parsed.y !== 1 ? 's' : ''}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280',
          font: { size: 11 },
        },
        grid: { color: 'rgba(107, 114, 128, 0.15)' },
      },
    },
    animation: { duration: 600 },
  };

  // ── Chart: donut de gastos por categoría ───────────────────────
  expensesChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  expensesChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#6B7280',
          font: { size: 11 },
          padding: 12,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed as number;
            return ` ${ctx.label}: ${value.toFixed(2)}€`;
          },
        },
      },
    },
    animation: { duration: 600 },
  };

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

    this.dataSub = combineLatest([
      this.habitService.getHabits(user.uid),
      this.expenseService.getExpenses(user.uid),
    ]).subscribe(([habits, expenses]) => {
      this.calcHabitStats(habits);
      this.calcMonthlyExpenses(expenses);
      this.buildChartData(habits, expenses);
    });
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }

  // ── Cálculos de stats ──────────────────────────────────────────

  private calcHabitStats(habits: Habit[]): void {
    this.totalHabits = habits.length;
    this.completedToday = habits.filter(h => this.habitService.isCompletedToday(h)).length;
    this.longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  }

  private calcMonthlyExpenses(expenses: Expense[]): void {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonth = expenses.filter(e => e.date.startsWith(monthPrefix));
    this.monthlyExpenses = this.expenseService.getMonthlyTotal(thisMonth);
  }

  // ── Construcción de datos para gráficos ───────────────────────

  private buildChartData(habits: Habit[], expenses: Expense[]): void {
    const isDark = document.body.classList.contains('dark');
    this.buildProgressChart(isDark);
    this.buildWeeklyChart(habits, isDark);
    this.buildExpensesChart(expenses, isDark);
  }

  private buildProgressChart(isDark: boolean): void {
    const pending = Math.max(this.totalHabits - this.completedToday, 0);
    // Si no hay hábitos, mostrar el anillo vacío en gris
    const data = this.totalHabits === 0 ? [0, 1] : [this.completedToday, pending];

    const accentColor  = isDark ? COLORS.accentDark : COLORS.accent;
    const surfaceColor = isDark ? COLORS.surface2Dark : COLORS.surface2;

    // Crear nuevo objeto para forzar la detección de cambios en ng2-charts
    this.progressChartData = {
      labels: ['Completados', 'Pendientes'],
      datasets: [{
        data,
        backgroundColor: [accentColor, surfaceColor],
        borderWidth: 0,
        hoverOffset: 4,
      }],
    };

    // Actualizar color de texto del tooltip según tema
    const textColor = isDark ? '#E8EAFF' : '#1A1B3A';
    this.progressChartOptions = {
      ...this.progressChartOptions,
      plugins: {
        ...this.progressChartOptions.plugins,
        tooltip: {
          ...this.progressChartOptions.plugins?.tooltip,
          titleColor: textColor,
          bodyColor: textColor,
        },
      },
    };
  }

  private buildWeeklyChart(habits: Habit[], isDark: boolean): void {
    // Generar los últimos 7 días (hoy inclusive) en YYYY-MM-DD
    const days: string[] = [];
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
      labels.push(DAY_NAMES[d.getDay()]);
    }

    // Para cada día, contar cuántos hábitos lo tienen en completionHistory
    const counts = days.map(day =>
      habits.filter(h => h.completionHistory.includes(day)).length
    );

    const textColor = isDark ? '#E8EAFF' : '#1A1B3A';
    const gridColor = isDark ? 'rgba(232, 234, 255, 0.1)' : 'rgba(107, 114, 128, 0.15)';

    this.weeklyChartData = {
      labels,
      datasets: [{
        label: 'Hábitos completados',
        data: counts,
        backgroundColor: isDark
          ? 'rgba(129, 140, 248, 0.8)'
          : 'rgba(99, 102, 241, 0.75)',
        borderRadius: 8,
        borderSkipped: false,
      }],
    };

    this.weeklyChartOptions = {
      ...this.weeklyChartOptions,
      plugins: {
        ...this.weeklyChartOptions.plugins,
        tooltip: {
          ...this.weeklyChartOptions.plugins?.tooltip,
          titleColor: textColor,
          bodyColor: textColor,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: isDark ? '#9CA3AF' : '#6B7280', font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: isDark ? '#9CA3AF' : '#6B7280', font: { size: 11 } },
          grid: { color: gridColor },
        },
      },
    };
  }

  private buildExpensesChart(expenses: Expense[], isDark: boolean): void {
    // Filtrar solo gastos del mes en curso
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthExpenses = expenses.filter(e => e.date.startsWith(monthPrefix));

    this.hasExpenses = thisMonthExpenses.length > 0;
    if (!this.hasExpenses) return;

    const breakdown = this.expenseService.getCategoryBreakdown(thisMonthExpenses);

    // Ordenar categorías por importe descendente y filtrar las que tienen valor > 0
    const entries = (Object.entries(breakdown) as [ExpenseCategory, number][])
      .filter(([, amount]) => amount > 0)
      .sort(([, a], [, b]) => b - a);

    const labels = entries.map(([cat]) => CATEGORY_LABELS[cat]);
    const data   = entries.map(([, amount]) => amount);
    const colors = entries.map(([cat]) => CATEGORY_COLORS[cat]);

    const textColor = isDark ? '#E8EAFF' : '#1A1B3A';

    this.expensesChartData = {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 6,
      }],
    };

    this.expensesChartOptions = {
      ...this.expensesChartOptions,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: isDark ? '#9CA3AF' : '#6B7280',
            font: { size: 11 },
            padding: 12,
            boxWidth: 12,
            boxHeight: 12,
          },
        },
        tooltip: {
          titleColor: textColor,
          bodyColor: textColor,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed as number;
              return ` ${ctx.label}: ${value.toFixed(2)}€`;
            },
          },
        },
      },
    };
  }

  // ── Getters de presentación ────────────────────────────────────

  get displayName(): string {
    return this.currentUser?.displayName?.split(' ')[0] ?? 'usuario';
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  /** Porcentaje de progreso diario para mostrar en el centro del donut */
  get progressPercent(): number {
    if (this.totalHabits === 0) return 0;
    return Math.round((this.completedToday / this.totalHabits) * 100);
  }

  // ── Navegación ─────────────────────────────────────────────────

  irAHabitos(): void {
    this.router.navigateByUrl('/tabs/habits');
  }

  irAGastos(): void {
    this.router.navigateByUrl('/tabs/expenses');
  }
}
