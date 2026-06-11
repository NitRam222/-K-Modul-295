import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-shell">
      <h1>Mein Profil</h1>
      @if (user) {
        <div class="profile-card">
          <h2>{{ user.displayName || user.username }}</h2>
          <p><strong>Benutzername:</strong> {{ user.username }}</p>
          <p><strong>E-Mail:</strong> {{ user.email || 'N/A' }}</p>
        </div>
      }
      @if (error) {
        <div class="profile-card error">{{ error }}</div>
      }
    </section>
  `,
  styles: [
    ".profile-card { background: #fff; border-radius: 18px; padding: 28px; box-shadow: 0 12px 28px rgba(0,0,0,0.05); }",
    ".error { color: #b91c1c; background: #fee2e2; margin-top: 12px; }"
  ]
})
export class UserProfilePageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly service = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  user?: User;
  error?: string;

  ngOnInit() {
    this.service.getProfile().subscribe({
      next: u => { this.user = u; this.cdr.detectChanges(); },
      error: () => {
        this.user = { username: this.auth.username, email: this.auth.email, displayName: this.auth.displayName };
        this.error = 'Profil konnte nicht geladen werden (Offline-Modus).';
        this.cdr.detectChanges();
      }
    });
  }
}
