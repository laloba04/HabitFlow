import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

import { ExpenseService, Expense, ExpenseCategory } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';

// Metadatos de cada categoría: emoji y etiqueta visible
export const CATEGORY_META: Record<ExpenseCategory, { emoji: string; label: string }> = {
  food:          { emoji: '🍔', label: 'Comida' },
  transport:     { emoji: '🚌', label: 'Transporte' },
  entertainment: { emoji: '🎬', label: 'Ocio' },
  health:        { emoji: '💊', label: 'Salud' },
  shopping:      { emoji: '🛍️', label: 'Compras' },
  bills:         { emoji: '📱', label: 'Facturas' },
  other:         { emoji: '📦', label: 'Otros' },
};

// Grupo de tarjetas con encabezado de fecha
export interface ExpenseGroup {
  label: string;   // 'Hoy', 'Ayer', 'dd/mm'
  date: string;    // YYYY-MM-DD
  items: Expense[];
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
  standalone: false,
})
export class ExpensesPage implements OnInit, OnDestroy {

  showForm = false;
  expenseForm!: FormGroup;

  // Mes visible en el filtro (formato YYYY-MM)
  activeMonth: string = this.getCurrentMonth();

  // Gastos del mes activo, agrupados por fecha
  groups: ExpenseGroup[] = [];

  // Totales para la cabecera
  monthlyTotal = 0;
  transactionCount = 0;

  // Categorías disponibles para el grid del formulario
  readonly categories = Object.entries(CATEGORY_META) as [ExpenseCategory, { emoji: string; label: string }][];
  readonly categoryMeta = CATEGORY_META;

  private allExpenses: Expense[] = [];
  private expenseSub?: Subscription;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      amount:      ['', [Validators.required, Validators.min(0.01)]],
      category:    ['food', Validators.required],
      description: ['', Validators.required],
      date:        [this.getTodayString(), Validators.required],
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.expenseSub = this.expenseService
        .getExpenses(user.uid)
        .subscribe(expenses => {
          this.allExpenses = expenses;
          this.applyMonthFilter();
        });
    }
  }

  ngOnDestroy(): void {
    this.expenseSub?.unsubscribe();
  }

  // ── Filtro de mes ──────────────────────────────────────────────

  get monthLabel(): string {
    const [year, month] = this.activeMonth.split('-').map(Number);
    const d = new Date(year, month - 1, 1);
    // Capitaliza la primera letra
    const label = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  prevMonth(): void {
    const [year, month] = this.activeMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    this.activeMonth = this.dateToYearMonth(d);
    this.applyMonthFilter();
  }

  nextMonth(): void {
    const [year, month] = this.activeMonth.split('-').map(Number);
    const d = new Date(year, month, 1);
    this.activeMonth = this.dateToYearMonth(d);
    this.applyMonthFilter();
  }

  get isCurrentMonth(): boolean {
    return this.activeMonth === this.getCurrentMonth();
  }

  // Filtra por mes y reagrupa
  private applyMonthFilter(): void {
    const filtered = this.allExpenses.filter(e => e.date.startsWith(this.activeMonth));
    this.monthlyTotal = this.expenseService.getMonthlyTotal(filtered);
    this.transactionCount = filtered.length;
    this.groups = this.buildGroups(filtered);
  }

  // Agrupa gastos por fecha con etiqueta legible
  private buildGroups(expenses: Expense[]): ExpenseGroup[] {
    const today = this.getTodayString();
    const yesterday = this.getYesterdayString();
    const map = new Map<string, Expense[]>();

    for (const e of expenses) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }

    // Ordenar fechas descendente
    const sorted = [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));

    return sorted.map(([date, items]) => ({
      date,
      label: date === today ? 'Hoy' : date === yesterday ? 'Ayer' : this.formatDateShort(date),
      items,
    }));
  }

  // ── Formulario ─────────────────────────────────────────────────

  openCreateForm(): void {
    this.expenseForm.reset({
      amount:      '',
      category:    'food',
      description: '',
      date:        this.getTodayString(),
    });
    this.showForm = true;
  }

  onDismissForm(): void {
    this.showForm = false;
  }

  selectCategory(cat: ExpenseCategory): void {
    this.expenseForm.get('category')?.setValue(cat);
  }

  async onCreateExpense(): Promise<void> {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const { amount, category, description, date } = this.expenseForm.value;

    const newExpense: Omit<Expense, 'id'> = {
      userId:      user.uid,
      amount:      parseFloat(amount),
      category:    category as ExpenseCategory,
      description: description.trim(),
      date,
      createdAt:   new Date().toISOString(),
    };

    try {
      await this.expenseService.createExpense(newExpense);
      this.showForm = false;
      // Si el gasto es del mes visible, el observable lo actualizará automáticamente
      if (date.startsWith(this.activeMonth)) {
        // no hace falta nada; la suscripción lo recoge
      } else {
        // Cambiar al mes del gasto para que el usuario lo vea
        this.activeMonth = date.substring(0, 7);
        this.applyMonthFilter();
      }
      await this.showToast('Gasto registrado');
    } catch {
      await this.showToast('No se pudo guardar el gasto. Inténtalo de nuevo.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  // ── Borrado ────────────────────────────────────────────────────

  async onDelete(expense: Expense): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar gasto',
      message: `¿Seguro que quieres eliminar "${expense.description}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.expenseService.deleteExpense(expense.id!);
              await this.showToast('Gasto eliminado');
            } catch {
              await this.showToast('No se pudo eliminar el gasto.', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Helpers de visualización ───────────────────────────────────

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  getCategoryEmoji(cat: ExpenseCategory): string {
    return CATEGORY_META[cat]?.emoji ?? '📦';
  }

  getCategoryLabel(cat: ExpenseCategory): string {
    return CATEGORY_META[cat]?.label ?? 'Otros';
  }

  // ── Utilidades de fecha ────────────────────────────────────────

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getYesterdayString(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  private getCurrentMonth(): string {
    return this.dateToYearMonth(new Date());
  }

  private dateToYearMonth(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  private formatDateShort(dateStr: string): string {
    const [, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  }

  private async showToast(message: string, color = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
