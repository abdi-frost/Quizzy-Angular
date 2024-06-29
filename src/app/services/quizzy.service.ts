import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizzyService {
  private questions: any[] = [];
  private quizState: any = {
    questions: [],
    questionIndex: 0,
    selectedOptions: []
  };

  private parameters: string = '';

  constructor(private http: HttpClient) {
    // Load quiz state from local storage if available
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      this.quizState = JSON.parse(savedState);
      console.log("Loading a quiz state from localStorage, ", this.quizState);
    }
  }

  private baseUrl = 'https://opentdb.com/';

  setQuizParams(params: any): void {
    const { category, format, difficulty, quantity } = params;
    this.parameters = `amount=${quantity}&category=${category}&difficulty=${difficulty}&type=${format}`;
    localStorage.setItem('parameters', this.parameters);
  }

  getQuizParams(): string | null {
    if (this.parameters) return this.parameters;
    else if (localStorage.getItem('parameters')) return localStorage.getItem('parameters');
    else return null;
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api_category.php`);
  }

  fetchQuestions(parameters: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api.php?${parameters}`).pipe(
      tap(response => {
        this.questions = response.results;
        this.quizState.questions = this.questions; // Update quiz state
        this.saveQuizState({questions : this.questions}); // Save updated quiz state to local storage
        localStorage.removeItem('parameters'); // Remove parameters from local storage after use
      })
    );
  }

  getQuestions(): any[] {
    return this.questions;
  }

  getQuizState(): any {
    return this.quizState;
  }

  saveQuizState(state: any): void {
    this.quizState = state;
    localStorage.setItem('quizState', JSON.stringify(this.quizState));
  }

  clearQuizState(): void {
    localStorage.removeItem('quizState');
    this.quizState = {
      questions: [],
      questionIndex: 0,
      selectedOptions: []
    };
  }
}
