import { Component, Input, inject, OnInit } from '@angular/core';
import { Database, ref, onValue, set } from '@angular/fire/database';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatchComponent} from '../match/match.component';

@Component({
    selector: 'app-final-phase',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: 'finale.component.html'
})
export class FinaleComponent implements OnInit {
    @Input() adminMode = false;
    db = inject(Database);
    knockoutPhases: any[] = [];
    winner: string | null = null;

    ngOnInit() {
        const phasesRef = ref(this.db, 'finalPhase');
        onValue(phasesRef, snapshot => {
            this.knockoutPhases = snapshot.val();
            this.determineWinner();
        });
    }

    saveMatchResult(phaseIndex: number, matchIndex: number) {
        const match = this.knockoutPhases[phaseIndex].matches[matchIndex];
        const matchRef = ref(this.db, `finalPhase/${phaseIndex}/matches/${matchIndex}`);

        set(matchRef, match).then(() => {
            this.updateNextPhaseTeams();
            this.determineWinner();
        });
    }

    updateNextPhaseTeams() {
        for (let i = 0; i < this.knockoutPhases.length - 1; i++) {
            const current = this.knockoutPhases[i];
            const next = this.knockoutPhases[i + 1];

            current.matches.forEach((match: any, idx: number) => {
                const scoreA = match.scoreA;
                const scoreB = match.scoreB;
                const targetMatch = next.matches[Math.floor(idx / 2)];
                const targetSlot = idx % 2 === 0 ? 'teamA' : 'teamB';

                if (scoreA === null || scoreB === null || scoreA === scoreB) {
                    targetMatch[targetSlot] = '?';
                } else {
                    targetMatch[targetSlot] = scoreA > scoreB ? match.teamA : match.teamB;
                }
            });
        }

        set(ref(this.db, 'finalPhase'), this.knockoutPhases);
    }



    determineWinner() {
        const final = this.knockoutPhases[this.knockoutPhases.length - 1].matches[0];

        if (
            final.scoreA !== null &&
            final.scoreB !== null &&
            final.scoreA !== final.scoreB
        ) {
            this.winner = final.scoreA > final.scoreB ? final.teamA : final.teamB;
        } else {
            this.winner = null;
        }
    }

}
