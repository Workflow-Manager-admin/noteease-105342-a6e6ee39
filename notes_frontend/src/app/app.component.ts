import { Component, OnInit } from '@angular/core';
import { NotesStateService } from './state/notes.state';
import { Observable } from 'rxjs';
import { Note } from './models/note.model';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotesMainComponent } from './components/notes-main/notes-main.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NotesMainComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  notes$: Observable<Note[]>;
  loading$: Observable<boolean>;
  selectedNoteId$: Observable<number | null>;

  notes: Note[] = [];
  loading: boolean = false;
  selectedNoteId: number | null = null;

  constructor(state: NotesStateService) {
    this.notes$ = state.notes$;
    this.loading$ = state.loading$;
    this.selectedNoteId$ = state.selectedNoteId$;
    this._state = state;
  }
  private _state: NotesStateService;

  ngOnInit(): void {
    this.notes$.subscribe(n => this.notes = n || []);
    this.loading$.subscribe(l => this.loading = l || false);
    this.selectedNoteId$.subscribe(i => this.selectedNoteId = i);
    this._state.loadNotes();
  }

  handleCreate() {
    this._state.selectNote(null);
  }

  handleSelect(noteId: number) {
    this._state.selectNote(noteId);
  }

  handleSearch(searchTerm: string) {
    this._state.setSearchTerm(searchTerm);
  }

  handleSave(event: { id?: number; note: Note }) {
    if (event.id) {
      this._state.updateNote(event.id, event.note);
    } else {
      this._state.createNote(event.note);
    }
  }

  handleDelete(noteId: number) {
    this._state.deleteNote(noteId);
  }
}
