import React from 'react'
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withMockFetch, renderWithRouter } from './testUtilities'
import App from '../App'
import {
  jaApiCalls,
  apiCalls
} from './_mocks'

const renderView = (route: string) => renderWithRouter(<App />, { route })

describe('Election Results screen', () => {
  const { reload } = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    })
  })
  afterAll(() => {
    jest.restoreAllMocks()
    window.location.reload = reload
  })

  it('shows a login screen for unauthenticated users', async () => {
    const expectedCalls = [apiCalls.unauthenticatedUser]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/jurisdiction/jurisdiction-id-1/results')
      await screen.findByRole('img', { name: 'Election Results Reporting, by VotingWorks' })
      const jaLoginButton = screen.getByRole('button', {
        name: 'Log in to your election',
      })
      expect(jaLoginButton).toHaveAttribute(
        'href',
        '/auth/jurisdictionadmin/start?redirectOnSucess=/election/election-id-1/jurisdiction/jurisdiction-id-1/results'
      )
      const eaLoginButton = screen.getByRole('link', {
        name: 'Log in as an admin',
      })
      expect(eaLoginButton).toHaveAttribute(
        'href',
        '/auth/electionadmin/start?redirectOnSucess=/election/election-id-1/jurisdiction/jurisdiction-id-1/results'
      )
    })
  })

  it('shows form validations and submit election results form with 1 contest', async () => {
    const expectedCalls = [
      jaApiCalls.getUser,
      jaApiCalls.fetchWhenResultsNotUploaded('election-id-1', 'jurisdiction-id-1'),
      jaApiCalls.getDefinitionFile('election-id-1'),
      jaApiCalls.postElectionResultsData('election-id-1', 'jurisdiction-id-1', {
        precinct: 'precinct-id-2',
        totalBallotsCast: '12',
        source: 'Data Entry',
        contests: [
          {
            id: 'contest-id-1',
            candidates: [
              {
                id: 'candidate-id-1',
                name: 'Candidate 1',
                numVotes: '8',
              },
              {
                id: '1',
                name: 'Write-in',
                numVotes: '4',
              },
            ],
          },
        ],
      }),
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/jurisdiction/jurisdiction-id-1/results')

      await screen.findByRole('heading', { name: 'Election Results Data' })
      screen.getByRole('heading', { name: 'Upload Results Data' })

      await act(async () => {
        const electionResultsButton = await screen.findByRole('button', {
          name: 'Submit',
        })
        userEvent.click(electionResultsButton)

        const precinctSelect = screen.getByRole('combobox', { name: /Precinct/ })
        const ballotsCastInput = screen.getByLabelText(/Total Ballots Cast/)
        const contestSelect = screen.getByRole('combobox', { name: /Contest \[1\]/ })

        // Validation tests
        await within(precinctSelect.closest('label')! as HTMLElement).findByText('Required')
        await within(contestSelect.closest('label')! as HTMLElement).findByText('Required')

        await within(ballotsCastInput.closest('label')! as HTMLElement).findByText('Required')
        userEvent.type(ballotsCastInput, 'string')
        await within(ballotsCastInput.closest('label')! as HTMLElement).findByText('Must be a number')
        userEvent.clear(ballotsCastInput)
        userEvent.type(ballotsCastInput, '-1')
        await within(ballotsCastInput.closest('label')! as HTMLElement).findByText('Must be a positive number')

        userEvent.selectOptions(precinctSelect, [
          screen.getByRole('option', {
            name: 'Precinct 2',
          }),
        ])
        userEvent.selectOptions(contestSelect, [
          screen.getByRole('option', {
            name: 'Contest 1',
          }),
        ])
        userEvent.click(electionResultsButton)

        const candidateInput = screen.getByLabelText(/Candidate 1/)
        await within(candidateInput.closest('label')! as HTMLElement).findByText('Required')
        userEvent.type(candidateInput, 'string')
        await within(candidateInput.closest('label')! as HTMLElement).findByText('Must be a number')
        userEvent.clear(candidateInput)
        userEvent.type(candidateInput, '-1')
        await within(candidateInput.closest('label')! as HTMLElement).findByText('Must be a positive number')

        const writeInInput = screen.getByLabelText(/Write-in/)
        await within(writeInInput.closest('label')! as HTMLElement).findByText('Required')
        userEvent.type(writeInInput, 'string')
        await within(writeInInput.closest('label')! as HTMLElement).findByText('Must be a number')
        userEvent.clear(writeInInput)
        userEvent.type(writeInInput, '-1')
        await within(writeInInput.closest('label')! as HTMLElement).findByText('Must be a positive number')

        // Fill out remaining election results form
        userEvent.clear(ballotsCastInput)
        userEvent.type(
          ballotsCastInput,
          '12'
        )
        userEvent.clear(candidateInput)
        userEvent.type(
          candidateInput,
          '8'
        )
        userEvent.clear(writeInInput)
        userEvent.type(
          writeInInput,
          '4'
        )
        userEvent.click(electionResultsButton)
      })
      expect(window.location.reload).toHaveBeenCalled();
    })
  })

  it('submit election results form with more than 1 contest', async () => {
    const expectedCalls = [
      jaApiCalls.getUser,
      jaApiCalls.fetchWhenResultsNotUploaded('election-id-1', 'jurisdiction-id-1'),
      jaApiCalls.getDefinitionFile('election-id-1'),
      jaApiCalls.postElectionResultsData('election-id-1', 'jurisdiction-id-1', {
        precinct: 'precinct-id-2',
        totalBallotsCast: '14',
        source: 'Data Entry',
        contests: [
          {
            id: 'contest-id-1',
            candidates: [
              {
                id: 'candidate-id-1',
                name: 'Candidate 1',
                numVotes: '4',
              },
              {
                id: '1',
                name: 'Write-in',
                numVotes: '2',
              },
            ],
          },
          {
            id: 'contest-id-3',
            candidates: [
              {
                id: 'candidate-id-1',
                name: 'Candidate 1',
                numVotes: '4',
              },
              {
                id: 'candidate-id-2',
                name: 'Candidate 2',
                numVotes: '3',
              },
              {
                id: '2',
                name: 'Write-in',
                numVotes: '1',
              },
            ],
          },
        ],
      }),
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/jurisdiction/jurisdiction-id-1/results')

      await screen.findByRole('heading', { name: 'Election Results Data' })

      await act(async () => {
        const electionResultsButton = await screen.findByRole('button', {
          name: 'Submit',
        })

        // Fill out election results form
        const precinctSelect = screen.getByRole('combobox', { name: /Precinct/ })
        const ballotsCastInput = screen.getByLabelText(/Total Ballots Cast/)
        const contest1Select = screen.getByRole('combobox', { name: /Contest \[1\]/ })

        userEvent.selectOptions(precinctSelect, [
          screen.getByRole('option', {
            name: 'Precinct 2',
          }),
        ])
        userEvent.type(
          ballotsCastInput,
          '14'
        )
        userEvent.selectOptions(contest1Select, [
          screen.getByRole('option', {
            name: 'Contest 1',
          }),
        ])
        const contest1candidate1Input = screen.getAllByLabelText(/Candidate 1/)[0]
        const contest1writeInInput = screen.getAllByLabelText(/Write-in/)[0]
        userEvent.type(
          contest1candidate1Input,
          '4'
        )
        userEvent.type(
          contest1writeInInput,
          '2'
        )

        userEvent.click(await screen.findByRole('button', { name: /\+/ }))

        const contest2Select = screen.getByRole('combobox', { name: /Contest \[2\]/ })
        userEvent.selectOptions(contest2Select, [
          screen.getAllByRole('option', {
            name: 'Contest 3',
          })[1],
        ])
        const contest2candidate1Input = screen.getAllByLabelText(/Candidate 1/)[1]
        const contest2candidate2Input = screen.getByLabelText(/Candidate 2/)
        const contest2writeInInput = screen.getAllByLabelText(/Write-in/)[1]
        userEvent.type(
          contest2candidate1Input,
          '4'
        )
        userEvent.type(
          contest2candidate2Input,
          '3'
        )
        userEvent.type(
          contest2writeInInput,
          '1'
        )

        userEvent.click(electionResultsButton)
      })
      expect(window.location.reload).toHaveBeenCalled();
    })
  })

  it('shows message when election results entered successfully', async () => {
    const expectedCalls = [
      jaApiCalls.getUser,
      jaApiCalls.fetchWhenResultsUploaded('election-id-1', 'jurisdiction-id-1'),
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/jurisdiction/jurisdiction-id-1/results')

      await screen.findByRole('heading', {
        name: 'Election 1',
      })
      screen.getByRole('heading', {
        name: 'Election results successfully entered!',
      })

      expect(screen.queryByRole('heading', { name: 'Election Results Data' })).not.toBeInTheDocument()
    })
  })

  it('shows upload results data file upload form and validation messages', async () => {
    const expectedCalls = [
      jaApiCalls.getUser,
      jaApiCalls.fetchWhenResultsNotUploaded('election-id-1', 'jurisdiction-id-1'),
      jaApiCalls.getDefinitionFile('election-id-1'),
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/jurisdiction/jurisdiction-id-1/results')

      await screen.findByRole('heading', { name: 'Upload Results Data' })
      screen.getByLabelText('Select a JSON...')
      const resultsFileButton = screen.getByRole('button', {
        name: 'Upload File',
      })
      userEvent.click(resultsFileButton)

      expect(await screen.findByText('You must upload a file')).toBeInTheDocument()
    })
  })
})