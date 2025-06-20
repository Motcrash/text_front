import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() isInternetConnected: boolean = true;
  @Input() isApiConnected: boolean = true;
  @Output() toggleSidebar = new EventEmitter<void>(); // ← Agregar este Output
  
  user: string = 'Edgar Delgado Cerrillo';
  pageTitle: string = '';
  public isLoading: boolean = false;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
  ) {}

  ngOnInit() {
    this.updateTitle();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      map(route => route.snapshot.data['title']) 
    ).subscribe((title: string) => {
      this.pageTitle = title;
    });
  }

  // Método para manejar el toggle del sidebar
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  updateTitle() {
    let route = this.activatedRoute.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    this.pageTitle = route.snapshot.data['title'] || 'Dashboard';
  }
}