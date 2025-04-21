import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PouleComponent} from '../poule/poule.component';
import {FinaleComponent} from '../finale/finale.component';
import {Database, onValue, ref} from '@angular/fire/database';

@Component({
    selector: 'tournoi',
    imports: [CommonModule, PouleComponent, FinaleComponent],
    templateUrl: './tournoi.component.html'
})
export class TournoiComponent implements OnInit {
    poules = ['A', 'B', 'C', 'D'];
    adminMode = false;
    toastMessage = '';
    showToast = false;
    db = inject(Database);

    ngOnInit() {
        this.adminMode = localStorage.getItem('admin') === 'true';

        const savedAdmin = localStorage.getItem('admin');
        if (savedAdmin === 'true') {
            this.adminMode = true;
        }
    }

    enableAdmin() {
        const passwordInput = prompt('Entrez le mot de passe admin');
        if (!passwordInput) return;

        const passwordRef = ref(this.db, 'admin/password');
        onValue(passwordRef, snapshot => {
            const correctPassword = snapshot.val();
            if (passwordInput === correctPassword) {
                this.adminMode = true;
                localStorage.setItem('admin', 'true');
                this.showToastMessage('✅ Mode Admin activé');
            } else {
                this.showToastMessage('❌ Mot de passe incorrect');
            }
        }, { onlyOnce: true });
    }

    disableAdmin() {
        this.adminMode = false;
        localStorage.removeItem('admin');
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

