import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuizzyService } from 'src/app/services/quizzy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  userAnswers: string[] = [];
  result: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private quizzyService: QuizzyService) { }

  ngOnInit(): void {
    const quizState = this.quizzyService.getQuizState();
    if (quizState.questions.length > 0 && quizState.selectedOptions.length > 0) {
      this.questions = quizState.questions;
      this.userAnswers = quizState.selectedOptions;
      this.calculateResults();
      localStorage.setItem('result', JSON.stringify(this.result));
    } else {
      this.router.navigate(['/']);
    }
  }

  calculateResults(): void {
    this.result = this.questions.map((question, index) => {
      const correctAnswer = question.correct_answer;
      const userAnswer = this.userAnswers[index];
      return {
        ...question,
        userAnswer,
        isCorrect: userAnswer === correctAnswer
      };
    });
  }

  calculateScore(): number {
    return this.result.filter((result) => result.isCorrect).length;
  }

  decode(html: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  }

  cleanupLocalStorage(): void {
    localStorage.removeItem('quizState');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
