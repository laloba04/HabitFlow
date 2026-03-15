import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private platform: Platform,
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  public async initPush() {
    if (!this.platform.is('capacitor')) {
      console.log('Push notifications are only available on native devices.');
      return;
    }

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === 'granted') {
      await PushNotifications.register();
    } else {
      console.log('Permisos de notificación no concedidos');
    }

    await this.addListeners();
  }

  private async addListeners() {
    await PushNotifications.addListener('registration', async token => {
      console.info('Token de registro recibido: ', token.value);
      await this.saveTokenToFirestore(token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Error de registro FCM: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Notificación recibida en foreground: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Acción realizada en la notificación: ', notification.actionId);
    });
  }

  private async saveTokenToFirestore(token: string) {
    // Nos suscribimos al estado del usuario para asegurar que guardamos el token
    // en cuanto la sesión esté lista o si el usuario hace login después de abrir la app.
    this.authService.currentUser$.subscribe(async user => {
      if (user) {
        try {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          await setDoc(userDocRef, { 
            fcmToken: token, 
            updatedAt: new Date().toISOString(),
            platform: 'android'
          }, { merge: true });
          console.log('Token guardado en Firestore correctamente para el usuario', user.uid);
        } catch (error) {
          console.error('Error al guardar el token push en Firestore:', error);
        }
      } else {
        console.warn('Esperando a que el usuario se loguee para guardar el Token de Push...');
      }
    });
  }
}
