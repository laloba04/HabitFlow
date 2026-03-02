import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';

import { HabitService, Habit } from '../../services/habit.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.page.html',
  styleUrls: ['./habits.page.scss'],
  standalone: false,
})
export class HabitsPage implements OnInit, OnDestroy {

  habits$!: Observable<Habit[]>;
  isLoading = false;
  showForm = false;
  habitForm!: FormGroup;
  completingHabitId: string | null = null;

  emptyAnimation: AnimationOptions = {
    path: 'assets/animations/empty.json',
    loop: true,
    autoplay: true
  };

  checkAnimation: AnimationOptions = {
    path: 'assets/animations/check.json',
    loop: false,
    autoplay: true
  };

  private userSub?: Subscription;

  constructor(
    private habitService: HabitService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.habitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      frequency: ['daily', Validators.required]
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.habits$ = this.habitService.getHabits(user.uid);
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  openCreateForm(): void {
    this.habitForm.reset({ frequency: 'daily' });
    this.showForm = true;
  }

  onDismissForm(): void {
    this.showForm = false;
    this.habitForm.reset({ frequency: 'daily' });
  }

  async onCreateHabit(): Promise<void> {
    if (this.habitForm.invalid) {
      this.habitForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    const { name, description, frequency } = this.habitForm.value;

    const newHabit: Omit<Habit, 'id'> = {
      userId: user.uid,
      name: name.trim(),
      description: description?.trim() || '',
      frequency,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      completionHistory: [],
      createdAt: new Date().toISOString()
    };

    try {
      await this.habitService.createHabit(newHabit);
      this.showForm = false;
      this.habitForm.reset({ frequency: 'daily' });
      await this.showToast('Hábito creado correctamente');
    } catch (error) {
      await this.showToast('No se pudo crear el hábito. Inténtalo de nuevo.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async onComplete(habit: Habit): Promise<void> {
    if (this.habitService.isCompletedToday(habit)) return;

    this.completingHabitId = habit.id!;
    try {
      await this.habitService.completeHabitToday(habit);
      setTimeout(() => { this.completingHabitId = null; }, 1500);
      await this.showToast('¡Hábito completado! Racha actualizada 🔥');
    } catch (error) {
      this.completingHabitId = null;
      await this.showToast('No se pudo registrar el hábito.', 'danger');
    }
  }

  async onDelete(habit: Habit): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar hábito',
      message: `¿Seguro que quieres eliminar "${habit.name}"? Se perderá toda su racha.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.habitService.deleteHabit(habit.id!);
              await this.showToast('Hábito eliminado');
            } catch (error) {
              await this.showToast('No se pudo eliminar el hábito.', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  isCompletedToday(habit: Habit): boolean {
    return this.habitService.isCompletedToday(habit);
  }

  private async showToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
