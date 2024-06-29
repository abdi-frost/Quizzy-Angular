import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuizzyService } from 'src/app/services/quizzy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentStep: number = 1;
  quizType: string = '';
  quizFormat: string = '';
  quizDifficulty: string = '';
  quizQuantity: number = 5; // Add this property

  typeList$!: Observable<any>;

  constructor(private quizzyService: QuizzyService, private router: Router) {}

  ngOnInit(): void {
    localStorage.removeItem('result');
    this.quizzyService.clearQuizState();
    this.typeList$ = this.quizzyService.getCategories().pipe(
      map(response => {
        console.log('Data fetched:', response);
        console.log('Data type:', typeof response.trivia_categories);
        return response.trivia_categories;
      })
    );
  }

  nextStep() {
    if (this.currentStep < 4) { // Update this to include the new step
      if (this.isValidSelection()) {
        this.currentStep++;
      }
    } else {
      const params = {
        category: this.quizType,
        format: this.quizFormat,
        difficulty: this.quizDifficulty,
        quantity: this.quizQuantity // Include the new property
      };
      // console.log(printVal);
      // save the selected params on the service
      this.quizzyService.setQuizParams(params);
      this.router.navigate(['/quiz']);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isValidSelection(): boolean {
    if (this.currentStep === 1) {
      return this.quizType !== '';
    } else if (this.currentStep === 2) {
      return this.quizFormat !== '';
    } else if (this.currentStep === 3) {
      return this.quizDifficulty !== '';
    } else if (this.currentStep === 4) { // Add this check for the new step
      return this.quizQuantity !== null && this.quizQuantity > 0;
    }
    return false;
  }
}
