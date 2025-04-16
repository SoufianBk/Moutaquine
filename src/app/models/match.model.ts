export class Match {
    teamA: string;
    teamB: string;
    time: string;
    scoreA: number | null = null;
    scoreB: number | null = null;
    processed: boolean = false;

    constructor(teamA: string, teamB: string, time: string) {
        this.teamA = teamA;
        this.teamB = teamB;
        this.time = time;
    }

    get isPlayed(): boolean {
        return this.scoreA !== null  && this.scoreB !== null;
    }

    get scoreDisplay(): string {
        return this.isPlayed ? `${this.scoreA} - ${this.scoreB}` : 'À jouer';
    }

    get statusIcon(): string {
        if (this.scoreA == null || this.scoreB == null) return '🕒';
        return '';
    }

}
