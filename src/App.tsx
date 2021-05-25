import React from 'react'
import './App.css'
import styled from 'styled-components'

import { ResultsCandidates, Results} from './config/types'
import {
  localeLongDateAndTime,
  localeWeekdayAndDate,
} from './utils/IntlDateTimeFormats'

import election from './data/election.json'

// TODO: Use external results when types are simpler.
// import electionResults from './data/electionResults.json'
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
        'writeIn': 0,
      },
    },
    '775023385': {
      candidates: {
        '775033203': 87,
        'writeIn': 0,
      },
    },
    '775023386': {
      candidates: {
        '775033204': 62,
        '775036126': 25,
        'writeIn': 0,
      },
    },
  },
}

const NoWrap = styled.span`
  white-space: nowrap;
`

const NavigationBanner = styled.div`
  background: #008080;
`
const Navigation = styled.div`
  display: flex;
  align-items: stretch;
`
const NavigationContent = styled.div`
  display: flex;
  flex-direction: column;
`
const SealImg = styled.img`
  max-width: 70px;
  margin: 0.5rem;
`
const NavHeader = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  color: #ffffff;
`

const NavTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
`
const NavTab = styled.a<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: ${({ active }) => active ? '#eeeeee' : '#999999'};
  border-radius: 0.25rem 0.25rem 0 0;
  color: ${({ active }) => active ? '#000000' : '#ffffff'};
  font-size: 1.25rem;
  text-decoration: none;
`

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  padding: 0.5rem;
  line-height: 1.25;
  @media (min-width: 768px) {
    padding: 1rem;
  }
  @media (min-width: ${1200 + (2 * 16)}px) {
    padding-right: 0;
    padding-left: 0;
  }
`
const Headline = styled.h1`
  font-size: 2rem;
`
const LastUpdated = styled.p`
  font-size: 0.8rem;
`

const DataPoint = styled.div`
  margin-top: 0.5rem;
  div:first-child {
    font-size: 1.25rem;
    font-weight: 700;
  }
  div:last-child {
    font-size: 0.8rem;
  }
`

const Contests = styled.div`
  display: grid;
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  grid-template-columns: repeat(1, 1fr);
  @media (min-width: 768px) {
    margin: 0 1rem;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: ${1200 + (2 * 16)}px) {
    margin: 0;
  }
`

const Contest = styled.div`
  flex: 1;
  padding: 1rem;
  background: #ffffff;
  box-shadow: 0 1px 4px #666666;
  @media (min-width: 768px) {
    border-radius: 0.25rem;
  }
`
const ContestSection = styled.div`
  font-size: 0.8rem;
`
const ContestTitle = styled.h2`
  font-size: 1.5rem;
`
const Row = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const Candidate = styled(Row)`
  padding-top: 0.5rem;
  border-top: 1px solid #999999;
  margin-top: 1rem;
  &:first-child {
    margin-top: 0.25rem;
  }
`

const CandidateDataColumn = styled.div`
  line-height: 1.25;
  &:last-child {
    margin-left: 0.5rem;
  }
`
const CandidateMain = styled.div`
  font-size: 1rem;
  font-weight: 700;
`
const CandidateDetail = styled.div`
  font-size: 0.8rem;
  white-space: nowrap;
`

const now = new Date()
const formatPercentage = (a: number, b: number): string =>
  `${(Math.round((a / b) * 10000) / 100).toFixed(2)}%`
const getPartyById = (id: string) =>
  election.parties.find((party) => party.id === id)
const sumCandidateVotes = (candidates: ResultsCandidates): number =>
  Object.keys(candidates).reduce((sum, key) => sum + candidates[key], 0)
const totalBallotsCounted = election.contests.reduce((prev, curr) =>
  prev + sumCandidateVotes(results.contests[curr.id].candidates), 0)

const App: React.FC = () => (
  <div>
    <NavigationBanner>
      <Container>
        <Navigation>
          <SealImg
            src={`/election-results-reporting${election.sealURL}`}
            alt="seal"
          />
          <NavigationContent>
            <NavHeader>
              <p>
                <div>{election.title}</div>
                <small>{localeWeekdayAndDate.format(new Date(election.date))}</small>
              </p>
            </NavHeader>
            <NavTabs>
              <NavTab active href="#active">Results</NavTab>
              <NavTab href="#precincts">Precincts</NavTab>
            </NavTabs>
          </NavigationContent>
        </Navigation>
      </Container>
    </NavigationBanner>
    <Container>
      <PageHeader>
        <Headline>Unoffical Results</Headline>
        <LastUpdated>
          Last updated:{' '}
          {localeLongDateAndTime.format(now.setMinutes(now.getMinutes() - 30))}
        </LastUpdated>
        <DataPoint>
          <div>{formatPercentage(totalBallotsCounted, results.registeredVoterCount)} Voter Turnout</div>
          <div>
            <NoWrap>{results.registeredVoterCount} registered voters /</NoWrap>{' '}
            <NoWrap>{totalBallotsCounted} ballots received and counted thus far</NoWrap>
          </div>
        </DataPoint>
        {/* <div>
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
        </div> */}
      </PageHeader>
    </Container>
    <Container>
      <Contests>
        {election.contests.map(
          ({ section, title, seats, candidates, id: contestId }) => {
            const contestVotes = sumCandidateVotes(
              results.contests[contestId].candidates
            )
            return (
              <Contest>
                <Row>
                  <div>
                    <ContestSection>{section}</ContestSection>
                    <ContestTitle>{title}</ContestTitle>
                  </div>
                  <CandidateDataColumn>
                    <CandidateDetail>
                      <small>{seats} seat</small>
                    </CandidateDetail>
                  </CandidateDataColumn>
                </Row>
                <div>
                  {candidates.map(({ id: candidateId, name, partyId }) => {
                    const candidateVotes =
                      results.contests[contestId].candidates[candidateId]
                    return (
                      <Candidate>
                        <CandidateDataColumn>
                          <CandidateMain as="h3">{name}</CandidateMain>
                          <CandidateDetail>{getPartyById(partyId)?.name}</CandidateDetail>
                        </CandidateDataColumn>
                        <CandidateDataColumn>
                          <CandidateMain>
                            {formatPercentage(candidateVotes, contestVotes)}
                          </CandidateMain>
                          <CandidateDetail>{candidateVotes} votes</CandidateDetail>
                        </CandidateDataColumn>
                      </Candidate>
                    )
                  })}
                </div>
              </Contest>
            )
          }
        )}
      </Contests>
    </Container>
  </div>
)

export default App
