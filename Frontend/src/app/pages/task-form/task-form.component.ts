import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { PriorityService } from '../../services/priority.service';
import { TaskService } from '../../services/task.service';
import { Category } from '../../models/category.model';
import { Priority } from '../../models/priority.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="page-shell">
      <h1>{{ editMode ? 'Edit Task' : 'New Task' }}</h1>
      <form [formGroup]="form" (ngSubmit)="submit()" class="task-form">
        <label>Titel</label> <input formControlName="title" />
        <label>Beschreibung</label> <textarea formControlName="description"></textarea>
        <label>Status</label>
        <select formControlName="status">
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">Progress</option>
          <option value="DONE">Done</option>
        </select>
        <label>Kategorie</label>
        <select formControlName="categoryId">
          <option value="">Keine</option>
          <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
        </select>
        <label>Priorität</label>
        <select formControlName="priorityId">
          <option value="">Keine</option>
          <option *ngFor="let p of priorities" [value]="p.id">{{ p.level }}</option>
        </select>
        <label>Datum</label> <input type="date" formControlName="dueDate" />
        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">Save</button>
          <button type="button" class="secondary" routerLink="/tasks">Cancel</button>
        </div>
      </form>
    </section>
  `,
  styles: [
    ".task-form { display: grid; gap: 12px; max-width: 500px; }",
    "input, textarea, select { width: 100%; border: 1px solid #ccc; border-radius: 8px; padding: 10px; }",
    ".form-actions { display: flex; gap: 12px; margin-top: 12px; }",
    "button { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; background: #457b9d; color: #fff; }"
  ]
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly catService = inject(CategoryService);
  private readonly prioService = inject(PriorityService);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    status: ['TODO', Validators.required],
    categoryId: [''],
    priorityId: [''],
    dueDate: ['']
  });
  categories: Category[] = [];
  priorities: Priority[] = [];
  editMode = false;
  private id?: number;

  ngOnInit() {
    this.catService.getAll().subscribe(d => this.categories = d);
    this.prioService.getAll().subscribe(d => this.priorities = d);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.id = +id;
      this.taskService.getById(this.id).subscribe(t => this.form.patchValue({
        title: t.title, description: t.description, status: t.status,
        categoryId: t.category?.id as any || '', priorityId: t.priority?.id as any || '', dueDate: t.dueDate || ''
      }));
    }
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: any = {
      ...v, id: this.id,
      category: v.categoryId ? { id: +v.categoryId } : null,
      priority: v.priorityId ? { id: +v.priorityId } : null
    };
    (this.editMode ? this.taskService.update(payload) : this.taskService.create(payload))
      .subscribe(() => this.router.navigate(['/tasks']));
  }
}
