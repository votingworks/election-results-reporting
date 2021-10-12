import React from 'react'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withMockFetch, renderWithRouter } from './testUtilities'
import App from '../App'
import {
  eaApiCalls,
  apiCalls,
} from './_mocks'

const renderView = (route: string) => renderWithRouter(<App />, { route })

describe('Admin screen', () => {
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

  it('Message when no elections are created and create election form validation | Election admin screen', async () => {   
    const expectedCalls = [
      eaApiCalls.getUser
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
      const createElectionButton = await screen.findByRole('button', {
        name: 'Create New Election',
      })
      userEvent.click(createElectionButton)

      expect(await screen.findByTestId('electionName-error')).toHaveTextContent('Required')
      expect(await screen.findByTestId('electionDate-error')).toHaveTextContent('Required')
      expect(await screen.findByTestId('pollsOpen-error')).toHaveTextContent('Required')
      expect(await screen.findByTestId('pollsClose-error')).toHaveTextContent('Required')
      expect(await screen.findByTestId('certificationDate-error')).toHaveTextContent('Required')
      const jurisdictionFileInput = await screen.findByText('Participating jurisdictions')
      await within(jurisdictionFileInput.closest('label')! as HTMLElement).findByText('File required')
      const definitionFileInput = await screen.findByText('Election definition')
      await within(definitionFileInput.closest('label')! as HTMLElement).findByText('File required')
    })
  })
})