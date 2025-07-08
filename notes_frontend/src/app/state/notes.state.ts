import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: 'root'
})
// PUBLIC_INTERFACE
export class NotesStateService {
  /**
   * Provides and manages application state for notes. Handles async loading, CRUD, and selection.
   */
  private notesSubject = new BehaviorSubject<Note[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private selectedNoteIdSubject = new BehaviorSubject<number | null>(null);
  private searchTermSubject = new BehaviorSubject<string>('');

  constructor(private _supabase: SupabaseService) {}

  private get supabase() {
    return this._supabase;
  }

  // PUBLIC_INTERFACE
  get notes$(): Observable<Note[]> {
    /** Observable stream for notes array. */
    return this.notesSubject.asObservable();
  }

  // PUBLIC_INTERFACE
  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  // PUBLIC_INTERFACE
  get selectedNoteId$(): Observable<number | null> {
    return this.selectedNoteIdSubject.asObservable();
  }

  // PUBLIC_INTERFACE
  get searchTerm$(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }

  // PUBLIC_INTERFACE
  setSearchTerm(value: string) {
    this.searchTermSubject.next(value);
    this.loadNotes();
  }

  // PUBLIC_INTERFACE
  selectNote(id: number | null) {
    this.selectedNoteIdSubject.next(id);
  }

  // PUBLIC_INTERFACE
  async loadNotes() {
    /** Loads notes from Supabase and updates state. */
    this.loadingSubject.next(true);
    try {
      const searchTerm = this.searchTermSubject.getValue();
      const notes = await this.supabase.getNotes(searchTerm);
      this.notesSubject.next(notes);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // PUBLIC_INTERFACE
  async createNote(note: Note) {
    this.loadingSubject.next(true);
    try {
      const newNote = await this.supabase.createNote(note);
      await this.loadNotes();
      this.selectNote(newNote.id);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // PUBLIC_INTERFACE
  async updateNote(id: number, note: Note) {
    this.loadingSubject.next(true);
    try {
      await this.supabase.updateNote(id, note);
      await this.loadNotes();
      this.selectNote(id);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: number) {
    this.loadingSubject.next(true);
    try {
      await this.supabase.deleteNote(id);
      await this.loadNotes();
      this.selectNote(null);
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
