import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'final-frontend';
  sidebarOpen = false;
  currentUser = 'Edgar Delgado Cerrillo';

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onNavigation(route: string) {
    // Manejar navegación desde el sidebar
    console.log('Navigating to:', route);
    
    // Si quieres implementar rutas reales más adelante:
    // this.router.navigate([route]);
    
    // Por ahora, solo cerrar el sidebar
    this.closeSidebar();
  }
}