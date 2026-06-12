import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { PriorityService } from '../../services/priority.service';
import { TaskService } from '../../services/task.service';
import { Category } from '../../models/category.model';
import { Priority } from '../../models/priority.model';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly catService = inject(CategoryService);
  private readonly prioService = inject(PriorityService);
  private readonly cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['TODO' as TaskStatus, Validators.required],
    categoryId: [{ value: '', disabled: true }],
    priorityId: [{ value: '', disabled: true }],
    dueDate: [''],
  });

  categories: Category[] = [];
  priorities: Priority[] = [];
  editMode = false;
  loadingOptions = true;

  private id?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editMode = true;
      this.id = Number(id);

      this.taskService.getById(this.id).subscribe((task) => {
        const ownerId = task.user?.id;

        this.loadOptions(ownerId, () => {
          this.form.patchValue({
            title: task.title,
            description: task.description || '',
            status: task.status || 'TODO',
            categoryId: task.category?.id ? String(task.category.id) : '',
            priorityId: task.priority?.id ? String(task.priority.id) : '',
            dueDate: task.dueDate || '',
          });
        });
      });
    } else {
      this.loadOptions();
    }
  }

  private loadOptions(userId?: number, afterLoad?: () => void) {
    this.loadingOptions = true;
    this.form.get('categoryId')?.disable();
    this.form.get('priorityId')?.disable();

    forkJoin({
      categories: this.catService.getAll(userId),
      priorities: this.prioService.getAll(userId),
    }).subscribe(({ categories, priorities }) => {
      this.categories = categories;
      this.priorities = priorities;
      this.loadingOptions = false;

      this.form.get('categoryId')?.enable();
      this.form.get('priorityId')?.enable();

      if (afterLoad) {
        afterLoad();
      }

      this.cdr.detectChanges();
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const v = this.form.getRawValue();
    const status = (v.status || 'TODO') as TaskStatus;

    const payload = {
      id: this.id,
      title: v.title || '',
      description: v.description || '',
      status,
      dueDate: v.dueDate || null,
      category: v.categoryId ? { id: Number(v.categoryId) } : null,
      priority: v.priorityId ? { id: Number(v.priorityId) } : null,
    } as any;

    if (this.editMode) {
      this.taskService.update(payload).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.create(payload).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }
}
