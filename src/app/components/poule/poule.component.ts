import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchComponent } from '../match/match.component';
import { Team } from '../../models/team.model';
import { Match } from '../../models/match.model';
import { Database, ref, onValue, set } from '@angular/fire/database';
import { inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-poule',
    imports: [CommonModule, FormsModule, MatchComponent],
    templateUrl: './poule.component.html'
})
export class PouleComponent implements OnInit {
    @Input() poule: string = '';
    @Input() adminMode: boolean = false;
    db = inject(Database);

    teams: Team[] = [];
    matches: Match[] = [];

    ngOnInit() {
        this.loadTeams();
        this.loadMatches();
    }

    loadTeams() {
        const teamRef = ref(this.db, `poules/${this.poule}/teams`);
        onValue(teamRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                this.teams = data.map((t: any) => {
                    const team = new Team(t.name);
                    Object.assign(team, t);
                    return team;
                });
            }
        });
    }

    loadMatches() {
        const matchRef = ref(this.db, `poules/${this.poule}/matches`);
        onValue(matchRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                this.matches = data.map((m: any) => {
                    const match = new Match(m.teamA, m.teamB, m.time);
                    match.scoreA = m.scoreA ?? null;
                    match.scoreB = m.scoreB ?? null;
                    match.processed = m.processed ?? false;
                    return match;
                });
            }
        });
    }


    updateMatchResult(matchResult: any) {
        const {teamA, teamB, scoreA, scoreB} = matchResult;

        if (scoreA === null || scoreB === null) return;

        const team1 = this.teams.find(t => t.name === teamA);
        const team2 = this.teams.find(t => t.name === teamB);

        if (!team1 || !team2) return;

        // Empêcher de compter plusieurs fois
        if (matchResult.processed) return;
        matchResult.processed = true;

        // Mise à jour : matchs joués
        team1.played += 1;
        team2.played += 1;

        // Buts marqués / encaissés
        team1.goalsFor = (team1.goalsFor || 0) + scoreA;
        team1.goalsAgainst = (team1.goalsAgainst || 0) + scoreB;

        team2.goalsFor = (team2.goalsFor || 0) + scoreB;
        team2.goalsAgainst = (team2.goalsAgainst || 0) + scoreA;

        // Victoires, défaites, nuls
        if (scoreA > scoreB) {
            team1.wins += 1;
            team2.losses += 1;
            team1.points += 3;
        } else if (scoreA < scoreB) {
            team2.wins += 1;
            team1.losses += 1;
            team2.points += 3;
        } else {
            team1.draws += 1;
            team2.draws += 1;
            team1.points += 1;
            team2.points += 1;
        }

        // Tri par points puis goal average
        this.teams.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const goalAvgA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
            const goalAvgB = (b.goalsFor || 0) - (b.goalsAgainst || 0);
            return goalAvgB - goalAvgA;
        });

        set(ref(this.db, `poules/${this.poule}/teams`), this.teams);
        set(ref(this.db, `poules/${this.poule}/matches`), this.matches);
    }


}
