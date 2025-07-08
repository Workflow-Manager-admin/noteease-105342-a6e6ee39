import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SidebarComponent {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: number | null = null;
  @Input() loading: boolean = false;
  @Output() create = new EventEmitter<void>();
  @Output() select = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  searchValue = '';

  onSearchInput(event: any) {
    const value = event.target.value;
    this.search.emit(value);
  }

  onSelectNote(id: number) {
    this.select.emit(id);
  }

  onCreate() {
    this.create.emit();
  }
}
