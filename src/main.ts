import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

import { environment } from './environments/environment';
import {TournoiComponent} from './app/components/tournoi/tournoi.component';
import {provideRouter} from '@angular/router';
import {HomeComponent} from './app/components/home/home.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideDatabase(() => getDatabase()),
        provideRouter([
            { path: '', component: HomeComponent },
            { path: 'tournoi', component: TournoiComponent }
        ])
    ]
}).catch(err => console.error(err));
