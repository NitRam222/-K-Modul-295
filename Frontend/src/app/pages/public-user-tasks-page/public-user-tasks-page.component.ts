import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-public-user-tasks-page',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  template: `
    <section class="page-shell">
      <h1>Fremde Aufgaben {{ owner ? 'von ' + owner : '' }}</h1>
      <div *ngIf="tasks.length; else none">
        <app-task-card *ngFor="let t of tasks" [task]="t" [clickable]="false"></app-task-card>
      </div>
      <ng-template #none><p>{{ error || 'Keine Aufgaben gefunden.' }}</p></ng-template>
    </section>
  `
})
export class PublicUserTasksPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(UserService);
  tasks: Task[] = [];
  owner = '';
  error = '';

  ngOnInit() {
    const user = this.route.snapshot.paramMap.get('username');
    if (user) this.service.getUserTasks(user).subscribe({
      next: ts => { this.tasks = ts; this.owner = ts[0]?.owner?.username || ''; },
      error: () => this.error = 'Fehler beim Laden.'
    });
  }
}
