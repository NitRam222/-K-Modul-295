import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-shell">
      <h1>Kategorien</h1>
      <p>Verwalten Sie Kategorien für Ihre Aufgaben.</p>
      <form class="inline-form" (ngSubmit)="createCategory()">
        <input [(ngModel)]="newName" name="categoryName" placeholder="Neue Kategorie" required />
        <button type="submit">Hinzufügen</button>
      </form>
      <ul class="list">
        @for (c of categories; track c.id) {
          <li>
            <span>{{ c.name }}</span>
            <button class="danger" (click)="deleteCategory(c.id)">Löschen</button>
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
export class CategoryPageComponent implements OnInit {
  private readonly service = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);
  categories: Category[] = [];
  newName = '';

  ngOnInit() { this.load(); }

  createCategory() {
    if (!this.newName.trim()) return;
    this.service.create({ name: this.newName.trim() }).subscribe(() => {
      this.newName = '';
      this.load();
    });
  }

  deleteCategory(id?: number) {
    if (id && window.confirm('Löschen?')) this.service.delete(id).subscribe(() => this.load());
  }

  private load() {
    this.service.getAll().subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges();
    });
  }
}
