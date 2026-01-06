import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Transações', route: '/transactions', icon: '💸' },
    { label: 'Metas', route: '/goals', icon: '🎯' },
    { label: 'Configurações', route: '/settings', icon: '⚙️' },
  ];

  constructor(public themeService: ThemeService) {}

  ngOnInit() {}
}
