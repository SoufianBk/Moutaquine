import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PouleComponent } from './components/poule/poule.component';
import { MatchComponent } from './components/match/match.component';
import { FinaleComponent } from './components/finale/finale.component';
import { HomeComponent } from './components/home/home.component';
import { TournoiComponent } from './components/tournoi/tournoi.component';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    PouleComponent,
    MatchComponent,
    FinaleComponent,
    HomeComponent,
    TournoiComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterLink
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
