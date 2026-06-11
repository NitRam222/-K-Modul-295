import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { RoleService } from '../../services/role.service';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskCardComponent],
  template: `
    <section class="page-shell">
      <div class="page-toolbar">
        <h1>Meine Aufgaben</h1>
        @if (role.hasUpdate()) {
          <button routerLink="/tasks/new">Neu</button>
        }
      </div>

      @if (tasks.length) {
        <div>
          @for (t of tasks; track t.id) {
            <app-task-card
              [task]="t"
              (deleted)="load()">
            </app-task-card>
          }
        </div>
      } @else {
        <p>Keine Aufgaben gefunden.</p>
      }
    </section>
  `,
  styles: [
    ".page-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }",
    "button { background: #457b9d; color: #fff; padding: 10px 18px; border: none; border-radius: 10px; cursor: pointer; }"
  ]
})
export class TaskListPageComponent implements OnInit {
  private readonly service = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly role = inject(RoleService);

  tasks: Task[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(d => {
      this.tasks = d;
      this.cdr.detectChanges();
    });
  }
}