import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'app-user-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent],
  template: `
    <section class="page-shell">
      <h1>Benutzer suchen</h1>
      <form class="inline-form" (ngSubmit)="search()">
        <input [(ngModel)]="query" name="q" placeholder="Suche..." />
        <button type="submit">Suchen</button>
      </form>
      @if (users.length) {
        <ul class="list">
          @for (u of users; track u.username) {
            <li tabindex="0" role="button" (click)="loadTasks(u)" (keydown.enter)="loadTasks(u)" (keydown.space)="$event.preventDefault(); loadTasks(u)">
              <strong>{{ u.displayName || u.username }}</strong>
              <small>{{ u.email }}</small>
            </li>
          }
        </ul>
      }
      @if (tasks.length) {
        <div class="tasks">
          <h2>Aufgaben von {{ selUser }}</h2>
          @for (t of tasks; track t.id) {
            <app-task-card [task]="t" [clickable]="false" (deleted)="search()"></app-task-card>
          }
        </div>
      }
    </section>
  `,
  styles: [
    ".inline-form { display: flex; gap: 10px; margin-bottom: 20px; }",
    "input { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #ccc; }",
    "button { padding: 10px 20px; border: none; border-radius: 8px; background: #457b9d; color: #fff; cursor: pointer; }",
    ".list { list-style: none; padding: 0; }",
    ".list li { background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; border: 1px solid transparent; }",
    ".list li:hover { border-color: #457b9d; }"
  ]
})
export class UserSearchPageComponent {
  private readonly service = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  query = '';
  users: User[] = [];
  tasks: Task[] = [];
  selUser = '';

  search() {
    if (this.query.length < 2) return;
    this.service.search(this.query).subscribe(res => { this.users = res; this.tasks = []; this.cdr.detectChanges(); });
  }

  loadTasks(user: User) {
    this.service.getUserTasks(user.username).subscribe(res => {
      this.tasks = res;
      this.selUser = user.displayName || user.username;
      this.users = [];
      this.cdr.detectChanges();
    });
  }
}
