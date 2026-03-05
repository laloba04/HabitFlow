import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { AuthService, AppUser } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {

  currentUser: AppUser | null = null;
  darkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    // Leer preferencia guardada o usar la del sistema como valor inicial
    const saved = localStorage.getItem('darkMode');
    this.darkMode = saved !== null
      ? saved === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Letra inicial del nombre para el avatar
  get avatarInitial(): string {
    const name = this.currentUser?.displayName ?? this.currentUser?.email ?? '?';
    return name.charAt(0).toUpperCase();
  }

  get displayName(): string {
    return this.currentUser?.displayName ?? 'Sin nombre';
  }

  get email(): string {
    return this.currentUser?.email ?? '';
  }

  // Aplica o quita el modo oscuro y persiste la elección
  onDarkModeChange(event: CustomEvent): void {
    this.darkMode = event.detail.checked;
    localStorage.setItem('darkMode', String(this.darkMode));

    if (this.darkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }

  async logout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Quieres cerrar tu sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: async () => {
            try {
              await this.authService.logout();
              await this.router.navigateByUrl('/login', { replaceUrl: true });
            } catch {
              const toast = await this.toastCtrl.create({
                message: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
                duration: 2500,
                color: 'danger',
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
