import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private pushService: PushNotificationService
  ) {
    // Si el usuario guardó preferencia la usamos; si no, tomamos la del sistema
    const saved = localStorage.getItem('darkMode');
    const isDark = saved !== null
      ? saved === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDark) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('ion-palette-dark');
    }
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Iniciar notificaciones push (pide permisos en dispositivos nativos)
      this.pushService.initPush();
    });
  }
}
