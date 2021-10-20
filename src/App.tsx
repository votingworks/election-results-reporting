import React, { useEffect, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import pluralize from 'pluralize'

import { CandidateContest, CompressedTally, Election } from '@votingworks/types'
import { readCompressedTally } from '@votingworks/utils'
import { ServerResult } from './config/types'
import {
  localeLongDateAndTime,
  localeWeekdayAndDate,
} from './utils/IntlDateTimeFormats'

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
  @media print, (min-width: 568px) {
    font-size: 1.5rem;
  }
  @media print {
    color: #000000;
  }
`

const ElectionDate = styled.p`
  margin-bottom: 1rem;
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
const NavTab = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: ${({ active }) => active ? '#eeeeee' : '#003334'};
  border-radius: 0.3rem 0.3rem 0 0;
  color: ${({ active }) => active ? '#000000' : '#ffffff'};
  font-size: 1.15rem;
  text-decoration: none;
`
const Main = styled.div`
  display: flex;
  min-height: 100vh;
`
const MainChild = styled.div`
  margin: auto;
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

const Actions = styled.div`
  display: none;
  float: right;
  @media (min-width: 768px) {
    display: block;
  }
`

const Button = styled.button`
  display: inline-block;
  padding: 0.5em 1em;
  border: none;
  background: #003334;
  border-radius: 0.25em;
  color: #ffffff;
  cursor: pointer;
  line-height: 1.25;
  text-decoration: none;
`

const Contests = styled.div`
  display: grid;
  margin-bottom: 1rem;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
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
const ContestMeta = styled.div`
  padding-top: 0.5rem;
  border-top: 1px solid #999999;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
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
    @media print {
      background: #000000;
    }
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

const Refresh = styled.p`
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.25;
  text-align: center;
  @media (min-width: 568px) {
    padding: 1.25rem 1rem 1rem;
  }
  @media (min-width: ${1200 + (2 * 16)}px) {
    padding-right: 0;
    padding-left: 0;
  }
  @media print {
    display: none;
  }
`
const PoweredByVotingWorks = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  color: inherit;
  font-size: 1rem;
  text-align: center;
  text-decoration: none;
`
const VotingWorksWordmark = styled.span`
  display: inline-block;
  overflow: hidden;
  width: 170px;
  height: 40px;
  margin-left: 0.5rem;
  background: bottom center url('${process.env.PUBLIC_URL}/votingworks-wordmark-purple.svg') no-repeat;
  text-indent: 100%;
  vertical-align: middle;
`

const formatPercentage = (a: number, b: number): string =>
  {
    if (a === 0) {
      return '0%'
    }
    if (a === b) {
      return '100%'
    }
    const quotient = b === 0 ? 0 : a / b
    return `${(Math.round(quotient * 10000) / 100).toFixed(2)}%`
  }

const sumCompressedTallies = (compressedTallies: CompressedTally[]): CompressedTally =>
  compressedTallies.reduce(
    (sum, tally) => sum.length === 0
      ? tally
      : sum.map(
        (contest, contestIndex) => contest.map(
          (option, tallyIndex) => option + tally[contestIndex][tallyIndex]
        )
      ),
    []
  )

const refreshInterval = 60
const App: React.FC = () => {
  const electionHash = process.env.REACT_APP_ELECTION_HASH

  const [ election, setElection ] = useState<Election | undefined>(undefined)
  const [ tallies, setTallies ] = useState<ServerResult[] | undefined>(undefined)
  const [ refreshCountdown, setRefreshCountdown ] = useState(0)

  const hasResults = !!tallies?.length
  const [ currentPage, setCurrentPage ] = useState('results')

  const fetchElection = async () => {
    const response = await fetch(`https://results.voting.works/election/${process.env.REACT_APP_ELECTION_HASH}/definition`)
    if (response.status >= 200 && response.status <= 299) {
      const jsonResponse: Election = await response.json()
      if (Object.keys(jsonResponse).length !== 0) {
        setElection(jsonResponse)
      }
    }
  }

  const fetchTallies = async () => {
    const response = await fetch(`https://results.voting.works/election/${process.env.REACT_APP_ELECTION_HASH}/tallies/${process.env.REACT_APP_IS_LIVE || 0}`)
    if (response.status >= 200 && response.status <= 299) {
      const jsonResponse: ServerResult[] = await response.json()
      if (Object.keys(jsonResponse).length !== 0) {
        setTallies(jsonResponse)
      }
    } else {
      console.log(response.status, response.statusText);
    }
  }

  // Init Results
  useEffect(() => {
    fetchElection()
  }, [])

  useEffect(() => {
    if (election) {
      fetchTallies()
    }
  }, [election])

  // Refresh Results
  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshCountdown((t) => t === 0 ? refreshInterval : t - 1)
      if (refreshCountdown === 0) {
        fetchTallies()
      }
    }, refreshInterval * 1000);
    return () => clearTimeout(timer)
  })

  const lastUpdatedDate = (tallies?.map((machine) => machine.seconds_since_epoch)[0] || 0) * 1000
  const summedTallies = sumCompressedTallies(tallies?.map((t) => t.tally) || [])

  const fullContestTallies = election && tallies && readCompressedTally(
    election,
    summedTallies,
    0,
    { foo: 0}
  ).contestTallies

  const electionCandidateContests = election?.contests.map((contest) => {
    if (contest.type === "candidate") {
      return contest
    }
  }) as CandidateContest[] | undefined

  const PoweredBy = () => (
    <Container>
      <PoweredByVotingWorks as="a" href="https://voting.works/">Powered by <VotingWorksWordmark>VotingWorks</VotingWorksWordmark></PoweredByVotingWorks>
    </Container>
  )

  if (!electionHash) {
    return(
      <Main>
        <MainChild>
          <Refresh>An election hash is required.</Refresh>
        </MainChild>
      </Main>
    )
  }

  if (!election) {
    return(
      <Main>
        <MainChild>
          <Refresh>Fetching the election definition…</Refresh>
        </MainChild>
      </Main>
    )
  } else {
    if (!tallies) {
      return (
        <Main>
          <MainChild>
            <Refresh>Fetching election results…</Refresh>
          </MainChild>
        </Main>
      )
    }
    return (
      <div>
        <NavigationBanner>
          <Container>
            <Navigation>
              <Brand>
                <SealImg
                  src={election.sealURL}
                  alt="seal"
                />
              </Brand>
              <NavigationContent>
                <NavHeader>{election.county.name}, {election.state}</NavHeader>
                <NavTabs>
                  <NavTab active={currentPage === 'results'} onClick={() => setCurrentPage('results')}>Results</NavTab>
                </NavTabs>
              </NavigationContent>
            </Navigation>
          </Container>
        </NavigationBanner>
        {currentPage === 'results' && (
          <React.Fragment>
            <Container>
              <PageHeader>
                {hasResults && (
                  <Actions>
                    <Button onClick={window.print}>Print Results</Button>
                  </Actions>
                )}
                <Headline>
                  Unofficial Results
                </Headline>
                {!!lastUpdatedDate && (
                  <LastUpdated>
                    Last updated on{' '}
                    <NoWrap>{localeLongDateAndTime.format(new Date(lastUpdatedDate))}</NoWrap>.{' '}
                    Results do not contain absentee ballot counts.
                  </LastUpdated>
                )}
                <ElectionTitle>{election.title}</ElectionTitle>
                <ElectionDate>
                  <NoWrap>{localeWeekdayAndDate.format(new Date(election.date))}</NoWrap>
                </ElectionDate>
              </PageHeader>
            </Container>
            <Container>
              <Contests>
                {electionCandidateContests?.map(
                  ({ section, title, seats, candidates: contestCandidates, id: contestId }) => {
                    const contestTally = fullContestTallies[contestId]
                    const { ballots, undervotes, overvotes } = contestTally.metadata
                    const writeIn = {
                      id: '__write-in',
                      name: 'write-in',
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
                          {seats > 1 && (
                            <CandidateDataColumn>
                              <CandidateDetail>
                                {seats} seat
                              </CandidateDetail>
                            </CandidateDataColumn>
                          )}
                        </Row>
                        <div>
                          {candidates
                            .sort((a, b) =>
                              fullContestTallies[contestId].tallies[b.id].tally
                              - fullContestTallies[contestId].tallies[a.id].tally
                            )
                            .map(({ id: candidateId, name, partyId }) => {
                              const candidateVotes = contestTally.tallies[candidateId].tally
                              const candidateParty = election.parties.find((p) => p.id === partyId)?.name
                              return (
                                <Candidate key={candidateId}>
                                  <CandidateProgressBar>
                                    <div style={{ width: formatPercentage(candidateVotes, ballots) }} />
                                  </CandidateProgressBar>
                                  <CandidateRow data-percentage="50%">
                                    <CandidateDataColumn>
                                      <CandidateMain as="h3">{name}</CandidateMain>
                                      <CandidateDetail>{candidateParty}</CandidateDetail>
                                    </CandidateDataColumn>
                                    <CandidateDataColumn>
                                      <CandidateMain>
                                        {formatPercentage(candidateVotes, ballots)}
                                      </CandidateMain>
                                      <CandidateDetail>{pluralize('vote', candidateVotes, true)}</CandidateDetail>
                                    </CandidateDataColumn>
                                  </CandidateRow>
                                </Candidate>
                              )
                            })
                          }
                          <ContestMeta>
                            <NoWrap>{pluralize('ballots', ballots, true)}</NoWrap> /{' '}
                            <NoWrap>{pluralize('undervotes', undervotes, true)}</NoWrap> /{' '}
                            <NoWrap>{pluralize('overvotes', overvotes, true)}</NoWrap>
                          </ContestMeta>
                        </div>
                      </Contest>
                    )
                  }
                )}
              </Contests>
            </Container>
            <Container>
              <Refresh>This page will automatically refresh when new results data are available.</Refresh>
            </Container>
            <PoweredBy />
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default App
