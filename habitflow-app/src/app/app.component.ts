import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
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
}
