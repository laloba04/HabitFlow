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
  // Tracks whether the password field is visible as plain text
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

  /** Convenience getter so the template can access controls without verbose paths */
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
      // Navigate into the app after successful login
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (error: unknown) {
      await loading.dismiss();
      await this.showError(error);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  private async showError(error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
    const alert = await this.alertCtrl.create({
      header: 'Error al iniciar sesión',
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
