import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PriorityService } from '../../services/priority.service';
import { Priority } from '../../models/priority.model';

@Component({
  selector: 'app-priority-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <h1>Prioritäten</h1>
      <p>Definieren Sie Prioritäten für Ihre Aufgaben.</p>
      <form class="inline-form" (ngSubmit)="create()">
        <input [(ngModel)]="newName" name="priorityLevel" placeholder="Neue Priorität" required />
        <button type="submit">Hinzufügen</button>
      </form>
      <ul class="list">
        @for (p of priorities; track p.id) {
          <li>
            <span>{{ p.level }}</span>
            <button class="danger" (click)="deletePriority(p.id)">Löschen</button>
          </li>
        }
      </ul>
    </section>
  `,
  styles: [
    ".inline-form { display: flex; gap: 12px; margin-bottom: 18px; }",
    "input { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; }",
    "button { background: #457b9d; color: #fff; border: none; padding: 12px 18px; border-radius: 10px; cursor: pointer; }",
    ".list { list-style: none; padding: 0; }",
    ".list li { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 14px 18px; border-radius: 14px; box-shadow: 0 5px 16px rgba(15,23,42,0.06); margin-bottom: 12px; }",
    ".danger { background: #e63946; }"
  ]
})
export class PriorityPageComponent implements OnInit {
  private readonly service = inject(PriorityService);
  private readonly cdr = inject(ChangeDetectorRef);
  priorities: Priority[] = [];
  newName = '';

  ngOnInit() { this.load(); }

  create() {
    if (!this.newName.trim()) return;
    this.service.create({ level: this.newName.trim() }).subscribe(() => {
      this.newName = '';
      this.load();
    });
  }

  deletePriority(id?: number) {
    if (id && window.confirm('Löschen?')) this.service.delete(id).subscribe(() => this.load());
  }

  private load() {
    this.service.getAll().subscribe(data => {
      this.priorities = data;
      this.cdr.detectChanges();
    });
  }
}
