import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qgmcdylmdodofjpuuklq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbWNkeWxtZG9kb2ZqcHV1a2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjkzMzAsImV4cCI6MjA2Njc0NTMzMH0.Q3dbZtBZOZXwPL73kF1TR-asuum7vAcBMqbo-ihaN7k';

@Injectable({
  providedIn: 'root'
})
// PUBLIC_INTERFACE
export class SupabaseService {
  /** Connects Angular frontend to Supabase backend for notes CRUD operations. */
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // PUBLIC_INTERFACE
  async getNotes(search: string = ''): Promise<any[]> {
    /**
     * Fetches notes from Supabase, optionally filtered by 'search' string matching title or content.
     */
    let query = this.supabase.from('notes').select('*').order('updated_at', { ascending: false });
    if (search.trim()) {
      query = this.supabase
        .from('notes')
        .select('*')
        .ilike('title', `%${search}%`)
        .order('updated_at', { ascending: false });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  // PUBLIC_INTERFACE
  async createNote(note: { title: string; content: string }): Promise<any> {
    /**
     * Inserts a new note into the Supabase 'notes' table.
     */
    const { data, error } = await this.supabase.from('notes').insert(note).select().single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async updateNote(id: number, note: { title: string; content: string }): Promise<any> {
    /**
     * Updates an existing note in the Supabase 'notes' table by ID.
     */
    const { data, error } = await this.supabase
      .from('notes')
      .update(note)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: number): Promise<void> {
    /**
     * Deletes a note from the Supabase 'notes' table by ID.
     */
    const { error } = await this.supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
  }

  // PUBLIC_INTERFACE
  async getNoteById(id: number): Promise<any | null> {
    /**
     * Fetches a single note by ID from the Supabase 'notes' table.
     */
    const { data, error } = await this.supabase.from('notes').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  }
}
