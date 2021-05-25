import React, { useEffect, useState } from 'react'
import './App.css'
import styled from 'styled-components'

import { ResultsCandidates, Results} from './config/types'
import {
  localeLongDateAndTime,
  localeWeekdayAndDate,
} from './utils/IntlDateTimeFormats'

import election from './data/err-election.json'

// TODO: Use external results when types are simpler.
// import electionResults from './data/electionResults.json'
const now = new Date()
const results: Results = {
  isOfficial: false,
  lastUpdatedDate: new Date(now.setMinutes(now.getMinutes() - 30)),
  registeredVoterCount: 2593,
  ballotsReceived: 327,
  ballotsCounted: 87,
  contests: {
    '775023387': {
      candidates: {
        '775033907': 248,
        '775036124': 427,
        '775036125': 120,
        'writeIn': 7,
      },
    },
    '775023385': {
      candidates: {
        '775033203': 447,
        'writeIn': 22,
      },
    },
    '775023386': {
      candidates: {
        '775033204': 322,
        '775036126': 325,
        'writeIn': 14,
      },
    },
  },
}

const NoWrap = styled.span`
  white-space: nowrap;
`

const NavigationBanner = styled.div`
  background: #336733;
`
const Navigation = styled.div`
  display: flex;
  align-items: stretch;
`
const NavigationContent = styled.div`
  display: flex;
  flex-direction: column;
`
const Brand = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  margin: 0.5rem;
  @media (min-width: 568px) {
    width: 120px;
    height: 90px;
    padding: 1rem;
    margin: 0.5rem 1rem;
  }
  @media print, (min-width: ${1200 + (2 * 16)}px) {
    margin-left: 0;
  }
`
const SealImg = styled.img`
  max-width: 100%;
  border-radius: 100%;
  box-shadow: 0 1px 4px #666666;
  @media (min-width: 568px) {
    position: absolute;
    top: 0;
    left: 0;
  }
`
const NavHeader = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  color: #ffffff;
  line-height: 1.25;
`
const NavTitle = styled.div`
  @media print, (min-width: 568px) {
    font-size: 1.5rem;
  }
`
const ElectionDate = styled.div`
  font-size: 0.9rem;
  @media print, (min-width: 568px) {
    font-size: 1rem;
  }
`
const NavTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  @media print {
    display: none;
  }
`
const NavTab = styled.a<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: ${({ active }) => active ? '#eeeeee' : '#003334'};
  border-radius: 0.3rem 0.3rem 0 0;
  color: ${({ active }) => active ? '#000000' : '#ffffff'};
  font-size: 1.15rem;
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
  @media (min-width: 568px) {
    padding: 1.25rem 1rem 1rem;
  }
  @media print, (min-width: ${1200 + (2 * 16)}px) {
    padding-right: 0;
    padding-left: 0;
  }
`
const Headline = styled.h1`
  font-size: 2rem;
`
const LastUpdated = styled.p`
  font-size: 0.9rem;
`
const ElectionTitle = styled.h2`
  margin-top: 0.5rem;
  font-size: 1.5rem;
`

const DataPoint = styled.div`
  margin-top: 0.5rem;
`

const Actions = styled.div`
  display: none;
  float: right;
  @media (min-width: 768px) {
    display: block;
  }
`

const PrintButton = styled.button`
  display: inline-block;
  padding: 0.5em 1em;
  border: none;
  background: #003334;
  border-radius: 0.25em;
  color: #ffffff;
  cursor: pointer;
  line-height: 1.25;
`

const Contests = styled.div`
  display: grid;
  margin-bottom: 1rem;
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  grid-template-columns: repeat(1, 1fr);
  @media print {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 568px) {
    margin-right: 1rem;
    margin-left: 1rem;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: ${1200 + (2 * 16)}px) {
    margin-right: 0;
    margin-left: 0;
  }
`

const Contest = styled.div`
  flex: 1;
  padding: 1rem 1rem 0.75rem;
  background: #ffffff;
  box-shadow: 0 1px 4px #666666;
  @media (min-width: 568px) {
    border-radius: 0.3rem;
  }
  @media print {
    border: 1px solid #000000;
    box-shadow: none;
  }
`
const ContestSection = styled.div`
  font-size: 0.9rem;
`
const ContestTitle = styled.h2`
  margin-top: 0.25rem;
  font-size: 1.5rem;
`
const Row = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const Candidate = styled.div`
  position: relative;
  padding-top: 0.5rem;
  border-top: 1px solid #999999;
  margin-top: 1rem;
  &:first-child {
    margin-top: 0.5rem;
  }
`

const CandidateProgressBar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  & > div {
    height: 4px;
    background: #ffc55d;
  }
`

const CandidateRow = styled(Row)`
  align-items: flex-start;
`

const CandidateDataColumn = styled.div`
  line-height: 1.25;
  &:last-child {
    margin-left: 0.5rem;
    text-align: right;
  }
`
const CandidateMain = styled.div`
  font-size: 1rem;
  font-weight: 700;
`
const CandidateDetail = styled.div`
  font-size: 0.9rem;
  white-space: nowrap;
`

const Refresh = styled.div`
  padding: 0.5rem;
  margin: 0 0 4rem;
  font-size: 0.9rem;
  text-align: center;
  @media (min-width: 568px) {
    padding: 1.25rem 1rem 1rem;
  }
  @media print, (min-width: ${1200 + (2 * 16)}px) {
    padding-right: 0;
    padding-left: 0;
  }
`

const ProgressBar = styled.div`
  position: relative;
  overflow: hidden;
  height: 3px;
  background: #336733;
  & > div {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 3px;
    background: #ffc55d;
    transition: transform 1s linear;
  }
`

const formatPercentage = (a: number, b: number): string =>
  `${(Math.round((a / b) * 10000) / 100).toFixed(2)}%`
const getPartyById = (id: string) =>
  election.parties.find((party) => party.id === id)
const sumCandidateVotes = (candidates: ResultsCandidates): number =>
  Object.keys(candidates).reduce((sum, key) => sum + candidates[key], 0)
const totalBallotsCounted = election.contests.reduce((prev, curr) =>
  prev + sumCandidateVotes(results.contests[curr.id].candidates), 0)

const refreshInterval = 60
const App: React.FC = () => {
  const [ refreshCountdown, setRefreshCountdown ] = useState(refreshInterval)
  if (refreshCountdown === 0) {
    console.log('Fetching new data!')
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshCountdown((t) => t === 0 ? refreshInterval : t - 1)
    }, 1000);
    return () => clearTimeout(timer)
  })
  return (
    <div>
      <ProgressBar>
        <div style={{
          transform: `translateX(${100 - (refreshCountdown / refreshInterval * 100)}%)`,
          transition: refreshCountdown == refreshInterval ? 'none' : undefined,
        }} />
      </ProgressBar>
      <NavigationBanner>
        <Container>
          <Navigation>
            <Brand>
              <SealImg
                src={`/election-results-reporting${election.sealURL}`}
                alt="seal"
              />
            </Brand>
            <NavigationContent>
              <NavHeader>
                <div>
                  <NavTitle>{election.county.name}, {election.state}</NavTitle>
                  {/* <ElectionDate>{localeWeekdayAndDate.format(new Date(election.date))}</ElectionDate> */}
                </div>
              </NavHeader>
              <NavTabs>
                <NavTab active href="#results">Results</NavTab>
                <NavTab href="#info">Voting Info</NavTab>
              </NavTabs>
            </NavigationContent>
          </Navigation>
        </Container>
      </NavigationBanner>
      <Container>
        <PageHeader>
          <Actions>
            <PrintButton onClick={() => {window.print()}}>Print Results</PrintButton>
          </Actions>
          <Headline>
            {results.isOfficial ? 'Offical Results':'Unoffical Results'}
          </Headline>
          <LastUpdated>
            Results last updated at{' '}
            {localeLongDateAndTime.format(results.lastUpdatedDate)}.{' '}
            Official results will be finalized when the election is certified on DATE.
          </LastUpdated>
          <div>
          </div>
          <ElectionTitle>{election.title}</ElectionTitle>
          <ElectionDate>
            <NoWrap>Election Day is {localeWeekdayAndDate.format(new Date(election.date))}.</NoWrap>{' '}
            <NoWrap>Vote from 7am – 7pm.</NoWrap>
          </ElectionDate>
          <DataPoint>
            <NoWrap>{formatPercentage(totalBallotsCounted, results.registeredVoterCount)} voter turnout =</NoWrap>{' '}
            <NoWrap>{results.registeredVoterCount} registered voters /</NoWrap>{' '}
            <NoWrap>
              {
                results.isOfficial
                  ? `${totalBallotsCounted} ballots counted`
                  : `${totalBallotsCounted} ballots counted thus far`
              }
            </NoWrap>
          </DataPoint>
        </PageHeader>
      </Container>
      <Container>
        <Contests>
          {election.contests.map(
            ({ section, title, seats, candidates: contestCandidates, id: contestId }) => {
              const contestVotes = sumCandidateVotes(
                results.contests[contestId].candidates
              )
              const writeIn = {
                id: 'writeIn',
                name: 'Write-In',
                partyId: ''
              }
              const candidates = [
                ...contestCandidates,
                writeIn,
              ]
              return (
                <Contest key={contestId}>
                  <Row>
                    <div>
                      <ContestSection>{section}</ContestSection>
                      <ContestTitle>{title}</ContestTitle>
                    </div>
                    <CandidateDataColumn>
                      <CandidateDetail>
                        {seats} winner
                      </CandidateDetail>
                    </CandidateDataColumn>
                  </Row>
                  <div>
                    {candidates
                      .sort((a, b) =>
                        results.contests[contestId].candidates[b.id]
                        - results.contests[contestId].candidates[a.id]
                      )
                      .map(({ id: candidateId, name, partyId }) => {
                      const candidateVotes =
                        results.contests[contestId].candidates[candidateId]
                      return (
                        <Candidate key={candidateId}>
                          <CandidateProgressBar>
                            <div style={{ width: formatPercentage(candidateVotes, contestVotes) }} />
                          </CandidateProgressBar>
                          <CandidateRow data-percentage="50%">
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
                          </CandidateRow>
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
      <Container>
        <Refresh>This page will automatically refresh every 1 minute.</Refresh>
      </Container>
    </div>
  )
}

export default App
