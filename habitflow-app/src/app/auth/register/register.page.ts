import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password        = group.get('password')?.value ?? '';
  const confirmPassword = group.get('confirmPassword')?.value ?? '';
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {

  registerForm: FormGroup;
  showPassword        = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: passwordMatchValidator }
    );
  }

  get name()            { return this.registerForm.get('name'); }
  get email()           { return this.registerForm.get('email'); }
  get password()        { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  get passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') &&
           (this.confirmPassword?.touched ?? false);
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { name, email, password } = this.registerForm.value;
      await this.authService.register(email, password, name);
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  private getFirebaseErrorMessage(error: unknown): string {
    const code = (error as { code?: string })?.code ?? '';

    const messages: Record<string, string> = {
      'auth/email-already-in-use':  'Este correo ya está registrado.',
      'auth/invalid-email':         'El formato del correo no es válido.',
      'auth/weak-password':         'La contraseña es demasiado débil. Mínimo 6 caracteres.',
      'auth/operation-not-allowed': 'El registro no está habilitado.',
      'auth/network-request-failed':'Sin conexión. Comprueba tu red.',
      'auth/too-many-requests':     'Demasiados intentos. Prueba más tarde.',
    };

    return messages[code] ?? 'Ocurrió un error inesperado.';
  }

  private async showFirebaseError(error: unknown): Promise<void> {
    const message = this.getFirebaseErrorMessage(error);
    const alert = await this.alertCtrl.create({
      header: 'Error al crear la cuenta',
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
