import React from 'react'
import './App.css'
import styled from 'styled-components'

import election from './data/election.json'
import {
  localeLongDateAndTime,
  localeWeekdayAndDate,
} from './utils/IntlDateTimeFormats'
// import electionResults from './data/electionResults.json'

export interface Dictionary<T> {
  [key: string]: T
}

type ResultsCandidates = Dictionary<number>

interface ResultsContest {
  candidates: ResultsCandidates
}

interface Results {
  registeredVoterCount: number
  ballotsReceived: number
  ballotsCounted: number
  contests: Dictionary<ResultsContest>
}

const results: Results = {
  registeredVoterCount: 2593,
  ballotsReceived: 327,
  ballotsCounted: 87,
  contests: {
    '775023387': {
      candidates: {
        '775033907': 28,
        '775036124': 47,
        '775036125': 12,
      },
    },
    '775023385': {
      candidates: {
        '775033203': 87,
      },
    },
    '775023386': {
      candidates: {
        '775033204': 62,
        '775036126': 25,
      },
    },
  },
}

const SealImg = styled.img`
  max-width: 100px;
`

const Contest = styled.div`
  padding: 1rem;
  border: 1px solid;
  margin: 1rem 1rem 1rem 0;
  float: left;
`

const now = new Date()
const formatPercentage = (a: number, b: number): string =>
  `${(Math.round((a / b) * 10000) / 100).toFixed(2)}%`
const getPartyById = (id: string) =>
  election.parties.find((party) => party.id === id)
const sumCandidateVotes = (candidates: ResultsCandidates): number =>
  Object.keys(candidates).reduce((sum, key) => sum + candidates[key], 0)
const App: React.FC = () => (
  <div className="App">
    <nav>
      <SealImg
        src={`/election-results-reporting${election.sealURL}`}
        alt="seal"
      />
      <h1>Election Reporting</h1>
      <div>
        Last updated:{' '}
        {localeLongDateAndTime.format(now.setMinutes(now.getMinutes() - 30))}
      </div>
    </nav>
    <div>
      <h1>Unoffical Results</h1>
      <h2>{election.title}</h2>
      <p>{localeWeekdayAndDate.format(new Date(election.date))}</p>
      <div>
        <h2>
          {formatPercentage(
            results.ballotsReceived,
            results.registeredVoterCount
          )}{' '}
          Voter Turnout
        </h2>
        <small>
          {results.ballotsReceived} ballots received /{' '}
          {results.registeredVoterCount} registered voters
        </small>
      </div>
      <div>
        <h2>
          {formatPercentage(results.ballotsCounted, results.ballotsReceived)}{' '}
          Ballots Counted
        </h2>
        <small>
          {results.ballotsCounted} ballots counted / {results.ballotsReceived}{' '}
          ballots received
        </small>
      </div>
    </div>
    <div>
      {election.contests.map(
        ({ section, title, seats, candidates, id: contestId }) => {
          const contestVotes = sumCandidateVotes(
            results.contests[contestId].candidates
          )
          return (
            <Contest>
              <div>{section}</div>
              <h2 className="contest-title">{title}</h2>
              <div>{seats} seat</div>
              <div>
                {candidates.map(({ id: candidateId, name, partyId }) => {
                  const candidateVotes =
                    results.contests[contestId].candidates[candidateId]
                  return (
                    <div>
                      <div>
                        <h3>{name} </h3>
                        <small>{getPartyById(partyId)?.name}</small>
                      </div>
                      <div>
                        <div>
                          {formatPercentage(candidateVotes, contestVotes)}
                        </div>
                        <div>{candidateVotes} votes</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Contest>
          )
        }
      )}
    </div>
  </div>
)

export default App
