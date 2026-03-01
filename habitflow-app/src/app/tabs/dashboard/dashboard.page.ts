import { Component, OnInit } from '@angular/core';
import { AuthService, AppUser } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {

  currentUser: AppUser | null = null;

  // Exposed so the template can use it with the date pipe
  readonly today = new Date();

  // Placeholder summary stats — will be replaced with real Firestore data
  readonly stats = [
    { label: 'Hábitos activos',   value: '0', icon: 'checkmark-circle-outline', color: 'success'  },
    { label: 'Racha más larga',   value: '0d', icon: 'flame-outline',            color: 'warning'  },
    { label: 'Gastos del mes',    value: '$0', icon: 'wallet-outline',           color: 'primary'  },
    { label: 'Hábitos hoy',       value: '0/0', icon: 'today-outline',           color: 'tertiary' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  /** Returns just the first name for the greeting */
  get displayName(): string {
    if (this.currentUser?.displayName) {
      return this.currentUser.displayName.split(' ')[0];
    }
    return 'usuario';
  }

  /** Greeting text based on current time of day */
  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
