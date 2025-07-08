import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes-main',
  templateUrl: './notes-main.component.html',
  styleUrls: ['./notes-main.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class NotesMainComponent implements OnChanges {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: number | null = null;
  @Input() loading: boolean = false;

  @Output() select = new EventEmitter<number>();
  @Output() save = new EventEmitter<{id?: number, note: Note}>();
  @Output() delete = new EventEmitter<number>();
  @Output() create = new EventEmitter<void>();

  editing = false;
  editTitle = '';
  editContent = '';
  private lastNoteId: number | null = null;

  public selectedNote: Note | null = null;

  ngOnChanges(changes: SimpleChanges) {
    this.selectedNote = this.notes.find(n => n.id === this.selectedNoteId) ?? null;
    if ('selectedNoteId' in changes || 'notes' in changes) {
      const selected = this.selectedNote;
      if (selected && selected.id !== this.lastNoteId) {
        this.editing = false;
        this.editTitle = selected.title || '';
        this.editContent = selected.content || '';
        this.lastNoteId = selected.id ?? null;
      }
      if (!selected) {
        this.editing = false;
        this.editTitle = '';
        this.editContent = '';
        this.lastNoteId = null;
      }
    }
  }

  startCreateMode() {
    this.editing = true;
    this.editTitle = '';
    this.editContent = '';
    this.lastNoteId = null;
    this.selectedNote = null;
  }

  startEditMode() {
    const selected = this.selectedNote;
    if (selected) {
      this.editing = true;
      this.editTitle = selected.title || '';
      this.editContent = selected.content || '';
    }
  }

  cancelEdit() {
    this.editing = false;
    const selected = this.selectedNote;
    if (selected) {
      this.editTitle = selected.title || '';
      this.editContent = selected.content || '';
    } else {
      this.editTitle = '';
      this.editContent = '';
    }
  }

  onSave() {
    if (this.editTitle.trim() === '' && this.editContent.trim() === '') {
      this.cancelEdit();
      return;
    }
    const note: Note = {
      title: this.editTitle,
      content: this.editContent
    };
    const selected = this.selectedNote;
    if (selected && selected.id) {
      this.save.emit({id: selected.id, note});
    } else {
      this.save.emit({note});
    }
    this.editing = false;
  }

  onDelete() {
    if (this.selectedNoteId) {
      let confirmed = true;
      // Browsers only. SSR safe
      if (typeof globalThis !== 'undefined' && 'window' in globalThis && typeof globalThis.window.confirm === 'function') {
        confirmed = globalThis.window.confirm('Are you sure you want to delete this note?');
      }
      if (confirmed) {
        this.delete.emit(this.selectedNoteId);
      }
    }
  }

  onSelect(id: number) {
    this.select.emit(id);
  }
}
