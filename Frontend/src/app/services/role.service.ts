import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly auth = inject(AuthService);

  hasRead(): boolean {
    return this.auth.hasRole('read');
  }

  hasUpdate(): boolean {
    return this.auth.hasRole('update');
  }

  isAdmin(): boolean {
    return this.auth.hasRole('admin');
  }
}
