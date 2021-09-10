export interface Dictionary<T> {
  [key: string]: T
}

export type ResultsCandidates = Dictionary<number>

export interface ResultsContest {
  candidates: ResultsCandidates
}

export interface Results {
  ballotsCounted: number
  ballotsReceived: number
  certificationDate: Date
  contests: Dictionary<ResultsContest>
  isOfficial: boolean
  lastUpdatedDate: Date
  registeredVoterCount: number
}
