import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() user: string = '';
  @Output() closeEvent = new EventEmitter<void>();
  @Output() navigationEvent = new EventEmitter<string>();

  currentRoute: string = '';

  constructor(private router: Router) {
    // Obtener la ruta actual
    this.currentRoute = this.router.url.substring(1) || 'dashboard';
  }

  closeSidebar() {
    this.closeEvent.emit();
  }

  navigateTo(route: string) {
    this.currentRoute = route;
    this.navigationEvent.emit(route);
    this.closeSidebar();
  }

  logout() {
    // Implementar lógica de logout
    console.log('Logout clicked');
    this.navigateTo('login');
  }
}