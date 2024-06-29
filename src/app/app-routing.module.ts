import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'
import { QuizComponent } from './components/quiz/quiz.component'
import { ResultComponent } from './components/result/result.component'

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "quiz", component: QuizComponent},
  { path: "result", component: ResultComponent},
  { path: "***", redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
