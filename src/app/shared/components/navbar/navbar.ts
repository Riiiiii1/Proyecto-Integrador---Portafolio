import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { signal } from '@angular/core';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
auth = inject(Auth);
isMobileMenuOpen = signal(false);

toggleMobileMenu() {
  this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
}
}
