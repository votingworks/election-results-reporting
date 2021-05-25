export interface Dictionary<T> {
  [key: string]: T
}

export type ResultsCandidates = Dictionary<number>

export interface ResultsContest {
  candidates: ResultsCandidates
}

export interface Results {
  isOfficial: boolean
  lastUpdatedDate: Date
  registeredVoterCount: number
  ballotsReceived: number
  ballotsCounted: number
  contests: Dictionary<ResultsContest>
}
