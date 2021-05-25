export interface Dictionary<T> {
  [key: string]: T
}

export type ResultsCandidates = Dictionary<number>

export interface ResultsContest {
  candidates: ResultsCandidates
}

export interface Results {
  registeredVoterCount: number
  ballotsReceived: number
  ballotsCounted: number
  contests: Dictionary<ResultsContest>
}
