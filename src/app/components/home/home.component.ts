import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PouleComponent} from '../poule/poule.component';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'home',
    imports: [CommonModule, PouleComponent, RouterLink],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    poules = ['A', 'B', 'C', 'D'];
    adminMode = false;
    toastMessage = '';
    showToast = false;


    ngOnInit() {
        this.adminMode = localStorage.getItem('admin') === 'true';
    }

    enableAdmin() {
        this.adminMode = true;
        this.showToastMessage('✅ Mode Admin activé');
    }

    disableAdmin() {
        this.adminMode = false;
        this.showToastMessage('🚪 Mode Admin désactivé');
    }

    showToastMessage(message: string) {
        this.toastMessage = message;
        this.showToast = true;

        setTimeout(() => {
            this.showToast = false;
        }, 3000);
    }

}
