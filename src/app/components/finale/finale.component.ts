import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match } from '../../models/match.model';
import { Database, ref, get } from '@angular/fire/database';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-finale',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './finale.component.html'
})
export class FinaleComponent implements OnInit {
    adminMode = false;
    db = inject(Database);

    bracket: Match[][] = [
        [], // Quart
        [ new Match('', '', '15:00'), new Match('', '', '16:00') ], // Demi
        [ new Match('', '', '17:00') ] // Finale
    ];

    ngOnInit() {
        this.generateQuarterFinals();
    }

    async generateQuarterFinals() {
        const poules = ['A', 'B', 'C', 'D'];
        const results: { [key: string]: string[] } = {};

        for (const poule of poules) {
            const snapshot = await get(ref(this.db, `poules/${poule}/teams`));
            const teams = snapshot.val();
            if (!teams) continue;

            const sorted = teams
                .sort((a: any, b: any) =>
                    b.points - a.points || b.goalAverage - a.goalAverage
                );
            results[poule] = [sorted[0].name, sorted[1].name];
        }

        // Adaptable organisation ici
        this.bracket[0] = [
            new Match(results['A']?.[0] || '', results['B']?.[1] || '', '10:00'),
            new Match(results['C']?.[0] || '', results['D']?.[1] || '', '11:00'),
            new Match(results['B']?.[0] || '', results['A']?.[1] || '', '12:00'),
            new Match(results['D']?.[0] || '', results['C']?.[1] || '', '13:00')
        ];
    }

    updateBracket() {
        for (let i = 0; i < 2; i++) {
            const m1 = this.bracket[0][i * 2];
            const m2 = this.bracket[0][i * 2 + 1];
            const semi = this.bracket[1][i];

            if (m1?.isPlayed && m2?.isPlayed) {
                semi.teamA = m1.scoreA! > m1.scoreB! ? m1.teamA : m1.teamB;
                semi.teamB = m2.scoreA! > m2.scoreB! ? m2.teamA : m2.teamB;
            }
        }

        const s1 = this.bracket[1][0];
        const s2 = this.bracket[1][1];
        const finale = this.bracket[2][0];

        if (s1?.isPlayed && s2?.isPlayed) {
            finale.teamA = s1.scoreA! > s1.scoreB! ? s1.teamA : s1.teamB;
            finale.teamB = s2.scoreA! > s2.scoreB! ? s2.teamA : s2.teamB;
        }
    }

    get winner(): string | null {
        const final = this.bracket[2][0];
        if (final.scoreA != null && final.scoreB != null) {
            return final.scoreA > final.scoreB ? final.teamA : final.teamB;
        }
        return null;
    }
}
