import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-match',
  imports: [CommonModule, FormsModule],
  templateUrl: './match.component.html'
})
export class MatchComponent {
  @Input() match: any;
  @Output() resultSubmitted = new EventEmitter<any>();

  submitResult() {
    this.resultSubmitted.emit(this.match);
  }
}
