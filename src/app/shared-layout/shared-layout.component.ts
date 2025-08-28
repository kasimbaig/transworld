import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shared-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.scss']
})
export class SharedLayoutComponent {
  visitorCount = {
    total: 4894078,
    sinceJan25: 63590,
    today: 111
  };

  constructor(private router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
