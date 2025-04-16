export class Team {
  name: string;
  played: number = 0;
  wins: number = 0;
  draws: number = 0;
  losses: number = 0;
  goalsFor: number = 0;
  goalsAgainst: number = 0;
  points: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  get goalAverage(): number {
    return this.goalsFor - this.goalsAgainst;
  }
}
