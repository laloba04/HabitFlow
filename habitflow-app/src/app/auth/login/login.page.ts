import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      await loading.dismiss();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (error: unknown) {
      await loading.dismiss();
      await this.showFirebaseError(error);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  private getFirebaseErrorMessage(error: unknown): string {
    const code = (error as { code?: string })?.code ?? '';

    const messages: Record<string, string> = {
      'auth/user-not-found':        'Usuario no encontrado. Comprueba el correo.',
      'auth/wrong-password':        'Contraseña incorrecta. Inténtalo de nuevo.',
      'auth/invalid-credential':    'Credenciales inválidas. Verifica tu correo y contraseña.',
      'auth/too-many-requests':     'Demasiados intentos fallidos. Prueba más tarde.',
      'auth/invalid-email':         'El formato del correo electrónico no es válido.',
      'auth/user-disabled':         'Esta cuenta ha sido deshabilitada. Contacta con soporte.',
      'auth/network-request-failed':'Sin conexión a internet. Verifica tu red.',
      'auth/operation-not-allowed': 'Inicio de sesión con email/contraseña no habilitado.',
    };

    return messages[code] ?? 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }

  private async showFirebaseError(error: unknown): Promise<void> {
    const message = this.getFirebaseErrorMessage(error);
    const alert = await this.alertCtrl.create({
      header: 'Error al iniciar sesión',
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
