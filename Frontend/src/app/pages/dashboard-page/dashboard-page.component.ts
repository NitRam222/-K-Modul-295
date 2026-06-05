import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { PriorityService } from '../../services/priority.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page-shell">
      <h1>Dashboard</h1>
      <p>Übersicht Ihrer Aufgaben, Kategorien und Prioritäten.</p>
      <div class="tiles">
        <article class="tile">
          <h2>{{ taskCount }}</h2>
          <p>Meine Aufgaben</p>
          <a routerLink="/tasks">Aufgaben ansehen</a>
        </article>
        <article class="tile">
          <h2>{{ catCount }}</h2>
          <p>Kategorien</p>
          <a routerLink="/categories">Verwalten</a>
        </article>
        <article class="tile">
          <h2>{{ prioCount }}</h2>
          <p>Prioritäten</p>
          <a routerLink="/priorities">Anzeigen</a>
        </article>
      </div>
    </section>
  `,
  styles: [
    ".tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-top: 20px; }",
    ".tile { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(15,23,42,0.08); }",
    ".tile h2 { margin: 0; font-size: 2.4rem; color: #1d3557; }",
    ".tile a { color: #1d3557; font-weight: 600; text-decoration: none; display: block; margin-top: 12px; }"
  ]
})
export class DashboardPageComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly catService = inject(CategoryService);
  private readonly prioService = inject(PriorityService);
  private readonly cdr = inject(ChangeDetectorRef);

  taskCount = 0;
  catCount = 0;
  prioCount = 0;

  ngOnInit() {
    this.taskService.getAll().subscribe(d => { this.taskCount = d.length; this.cdr.detectChanges(); });
    this.catService.getAll().subscribe(d => { this.catCount = d.length; this.cdr.detectChanges(); });
    this.prioService.getAll().subscribe(d => { this.prioCount = d.length; this.cdr.detectChanges(); });
  }
}
