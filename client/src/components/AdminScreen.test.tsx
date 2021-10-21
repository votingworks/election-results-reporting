import React from 'react'
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withMockFetch, renderWithRouter } from './testUtilities'
import App from '../App'
import {
  eaApiCalls,
  jaApiCalls,
  apiCalls,
  jurisdictionFile,
  definitionFile
} from './_mocks'

const renderView = (route: string) => renderWithRouter(<App />, { route })

describe('Admin screen', () => {
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
      renderView('/admin')
      await screen.findByRole('img', { name: 'Election Results Reporting, by VotingWorks' })
      const jaLoginButton = screen.getByRole('button', {
        name: 'Log in to your election',
      })
      expect(jaLoginButton).toHaveAttribute(
        'href',
        '/auth/jurisdictionadmin/start?redirectOnSucess=/admin'
      )
      const eaLoginButton = screen.getByRole('link', {
        name: 'Log in as an admin',
      })
      expect(eaLoginButton).toHaveAttribute('href', '/auth/electionadmin/start?redirectOnSucess=/admin')
    })
  })

  it('shows a message when an auth error occurs', async () => {
    const expectedCalls = [apiCalls.unauthenticatedUser]
    await withMockFetch(expectedCalls, async () => {
      renderView(
        '/admin?error=unauthorized&message=You+have+been+logged+out+due+to+inactivity.'
      )
      await screen.findByText('You have been logged out due to inactivity.')
    })
  })

  it('shows form validations, submission - Create new election and Message for no active elections | Election admin', async () => {
    const newElectionData:FormData = new FormData()
    newElectionData.append('id', '')
    newElectionData.append('electionName', 'Election 1')
    newElectionData.append('organizationId', 'org-id-1')
    newElectionData.append('pollsOpen', 'Tue Oct 12 2021 10:00:00 GMT+0530')
    newElectionData.append('pollsClose', 'Tue Oct 12 2021 18:00:00 GMT+0530')
    newElectionData.append('pollsTimezone', 'CST')
    newElectionData.append('certificationDate', 'Fri Oct 22 2021 00:00:00 GMT+0530')
    newElectionData.append(
      'jurisdictions',
      jurisdictionFile,
      jurisdictionFile.name
    )
    newElectionData.append(
      'definition',
      definitionFile,
      definitionFile.name
    )  

    const expectedCalls = [
      eaApiCalls.getUser,
      eaApiCalls.postNewElection(newElectionData),
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/admin')
      await screen.findByRole('heading', {
        name: 'Organization 1',
      })
      screen.getByText(
        "You haven't created any elections yet for Organization 1"
      )

      // Try to create an election without typing in an election name
      screen.getByRole('heading', { name: 'Create New Election' })
      
      await act(async () => {
        const createElectionButton = await screen.findByRole('button', {
          name: 'Create New Election',
        })
        userEvent.click(createElectionButton)

        expect(await screen.findByTestId('electionName-error')).toHaveTextContent('Required')
        expect(screen.getByTestId('electionDate-error')).toHaveTextContent('Required')
        expect(screen.getByTestId('pollsOpen-error')).toHaveTextContent('Required')
        expect(screen.getByTestId('pollsClose-error')).toHaveTextContent('Required')
        expect(screen.getByTestId('certificationDate-error')).toHaveTextContent('Required')
        const jurisdictionFileInput = screen.getByText('Participating jurisdictions')
        await within(jurisdictionFileInput.closest('label')! as HTMLElement).findByText('File required')
        const definitionFileInput = screen.getByText('Election definition')
        await within(definitionFileInput.closest('label')! as HTMLElement).findByText('File required')

        // Create a new election
        userEvent.upload(
          await screen.findByLabelText('Select a CSV...'),
          jurisdictionFile
        )
        userEvent.upload(
          await screen.findByLabelText('Select a JSON...'),
          definitionFile
        )
        userEvent.type(
          screen.getByLabelText(/Election name/),
          'Election 1'
        )
        userEvent.type(
          screen.getByLabelText(/Election date/),
          '2021-10-12'
        )
        userEvent.type(
          screen.getByLabelText(/Polls open/),
          '10:00'
        )
        userEvent.type(
          screen.getByLabelText(/Polls close/),
          '18:00'
        )
        userEvent.clear(screen.getByLabelText(/Timezone/))
        userEvent.type(
          screen.getByLabelText(/Timezone/),
          'CST'
        )
        userEvent.type(
          screen.getByLabelText(/Certification date/),
          '2021-10-22'
        )
        userEvent.click(createElectionButton)
      })
      expect(window.location.reload).toHaveBeenCalled();
    })
  })

  it('shows create new election form and active elections list | Election Admin', async () => {
    const expectedCalls = [
      eaApiCalls.getUserWithElection,
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/admin')

      await screen.findByRole('heading', {
        name: 'Active Elections',
      })
      const orgHeading = await screen.findByRole('heading', {
        name: 'Organization 1',
      })
      within(orgHeading.closest('div')! as HTMLElement).getByRole('button', {
        name: 'Election 1',
      })

      await screen.findByRole('heading', {
        name: 'Create New Election',
      })
      expect(screen.getByLabelText(/Election name/)).toHaveValue('')
    })
  })

  it('shows a list of elections with multiple orgs and create election form | Election Admin', async () => {
    const newElectionData:FormData = new FormData()
    newElectionData.append('id', '')
    newElectionData.append('electionName', 'Election 1')
    newElectionData.append('organizationId', 'org-id-2')
    newElectionData.append('pollsOpen', 'Tue Oct 12 2021 10:00:00 GMT+0530')
    newElectionData.append('pollsClose', 'Tue Oct 12 2021 18:00:00 GMT+0530')
    newElectionData.append('pollsTimezone', 'CST')
    newElectionData.append('certificationDate', 'Fri Oct 22 2021 00:00:00 GMT+0530')
    newElectionData.append(
      'jurisdictions',
      jurisdictionFile,
      jurisdictionFile.name
    )
    newElectionData.append(
      'definition',
      definitionFile,
      definitionFile.name
    )

    const expectedCalls = [
      eaApiCalls.getUserWithMultipleOrgs,
      eaApiCalls.postNewElection(newElectionData),
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/admin')

      // Two orgs and their elections get displayed
      const org1Heading = await screen.findByRole('heading', {
        name: 'Organization 1',
      })
      within(org1Heading.closest('div')! as HTMLElement).getByRole('button', {
        name: 'Election 1',
      })
      const org2Heading = screen.getByRole('heading', {
        name: 'Organization 2',
      })
      within(org2Heading.closest('div')! as HTMLElement).getByText(
        "You haven't created any elections yet for Organization 2"
      )

      // Select an organization
      const orgSelect = screen.getByRole('combobox', { name: /Organization/ })
      expect(
        screen.getByRole('option', {
          name: 'Organization 1',
        })
      ).toHaveProperty('selected', true)
      userEvent.selectOptions(orgSelect, [
        screen.getByRole('option', {
          name: 'Organization 2',
        }),
      ])

      await act(async () => {
        const createElectionButton = await screen.findByRole('button', {
          name: 'Create New Election',
        })

        // Create a new election
        userEvent.upload(
          await screen.findByLabelText('Select a CSV...'),
          jurisdictionFile
        )
        userEvent.upload(
          await screen.findByLabelText('Select a JSON...'),
          definitionFile
        )
        userEvent.type(
          screen.getByLabelText(/Election name/),
          'Election 1'
        )
        userEvent.type(
          screen.getByLabelText(/Election date/),
          '2021-10-12'
        )
        userEvent.type(
          screen.getByLabelText(/Polls open/),
          '10:00'
        )
        userEvent.type(
          screen.getByLabelText(/Polls close/),
          '18:00'
        )
        userEvent.clear(screen.getByLabelText(/Timezone/))
        userEvent.type(
          screen.getByLabelText(/Timezone/),
          'CST'
        )
        userEvent.type(
          screen.getByLabelText(/Certification date/),
          '2021-10-22'
        )
        userEvent.click(createElectionButton)
      })
      expect(window.location.reload).toHaveBeenCalled();
    })
  })

  it('shows a list of elections | Jurisdiction Admins', async () => {
    const expectedCalls = [
      jaApiCalls.getUser,
      jaApiCalls.fetchWhenResultsNotUploaded('election-id-1', 'jurisdiction-id-1'),
      jaApiCalls.getDefinitionFile('election-id-1')
    ]
    await withMockFetch(expectedCalls, async () => {
      const { history } = renderView('/admin')

      await screen.findByRole('heading', {
        name: 'Election wise Jurisdictions',
      })
      // Two elections and their jurisdictions get displayed
      const election1Heading = await screen.findByRole('heading', {
        name: 'Election 1-',
      })
      const j1Button = within(election1Heading.closest('div')! as HTMLElement).getByRole(
        'button', {
          name: 'Jurisdiction 1',
        }
      )
      const election2Heading = await screen.findByRole('heading', {
        name: 'Election 2-',
      })
      within(election2Heading.closest('div')! as HTMLElement).getByRole('button', {
        name: 'Jurisdiction 2',
      })

      // Click on a jurisdiction to go to the election results page
      await act( async () => {
        userEvent.click(j1Button)
        await screen.findByText('Jurisdiction: Jurisdiction 1')
        expect(history.location.pathname).toEqual('/election/election-id-1/jurisdiction/jurisdiction-id-1/results')
      })
    })
  })

  it('show note if no elections for ja user | Admin screen', async () => {
    const expectedCalls = [jaApiCalls.getUserWithoutElections]
    await withMockFetch(expectedCalls, async () => {
      renderView('/admin')

      await screen.findByText(
        "You don't have any available elections at the moment"
      )
    })
  })

  it('redirects to election results screen if only one election exists for JA', async () => {
    const expectedCalls = [
      jaApiCalls.getUserWithOneElection,
      jaApiCalls.fetchWhenResultsNotUploaded('election-id-1', 'jurisdiction-id-1'),
      jaApiCalls.getDefinitionFile('election-id-1')
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/admin')

      await screen.findByText('Jurisdiction: Jurisdiction 1')
      expect(await screen.findByRole('heading', {
        name: 'Election Results Data',
      })).toBeInTheDocument()
    })
  })
})