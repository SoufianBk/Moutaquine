import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, RouterLink],
    templateUrl: './app.component.html'
})
export class AppComponent {
    isScrolled = false;

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 50;
    }
}
