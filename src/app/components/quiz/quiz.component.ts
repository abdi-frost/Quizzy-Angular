import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuizzyService } from 'src/app/services/quizzy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  questionIndex: number = 0;
  maxIndex: number = 0;
  selectedOptions: string[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private quizzyService: QuizzyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const quizState = this.quizzyService.getQuizState();

    if (quizState.questions.length > 0) {
      this.questions = quizState.questions;
      this.selectedOptions = quizState.selectedOptions || [];
      this.questionIndex = quizState.questionsIndex || 0;
      this.maxIndex = this.questions.length - 1;
      console.log("the quiz state we got in the quiz component", quizState);
    } else {
      const params = this.quizzyService.getQuizParams();
      if (!params) {
        this.router.navigate(['/']);
      } else {
        this.subscription.add(
          this.quizzyService.fetchQuestions(params).subscribe(response => {
            this.questions = response.results;
            this.questions.forEach((question: any) => {
              question.options = this.shuffleOptions(question);
            });
            this.maxIndex = this.questions.length - 1;
            this.saveState({questions: this.questions});
          })
        );
      }
    }
  }

  fetchQuestionsAgain(): void {
    const params = this.quizzyService.getQuizParams();
    if (!params) {
      this.router.navigate(['/']);
    } else {
      this.subscription.add(
        this.quizzyService.fetchQuestions(params).subscribe(response => {
          this.questions = response.results;
          this.questions.forEach((question: any) => {
            question.options = this.shuffleOptions(question);
          });
          this.maxIndex = this.questions.length - 1;
          this.saveState({questions: this.questions});
        })
      );
    }
  }

  handleClickAnswer(selectedOption: string): void {
    this.selectedOptions[this.questionIndex] = selectedOption;
    this.saveState({selectedOptions: this.selectedOptions});

    if (this.questionIndex < this.maxIndex) {
      this.questionIndex += 1;
      this.saveState({questionsIndex: this.questionIndex});
    } else {
      this.cleanupLocalStorage();
      this.router.navigate(['/result']);
    }
  }

  prevQuestion(): void {
    if (this.questionIndex > 0) {
      this.questionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.questionIndex < this.maxIndex) {
      this.questionIndex++;
    }
  }

  decode(html: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  }

  shuffleOptions(question: any): string[] {
    const options = [question.correct_answer, ...question.incorrect_answers];
    return options.sort(() => Math.random() - 0.5);
  }

  saveState(obj: any): void {
    const prevState = this.quizzyService.getQuizState()
    this.quizzyService.saveQuizState({...prevState, ...obj});
  }

  cleanupLocalStorage(): void {
    localStorage.removeItem('quizState');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
