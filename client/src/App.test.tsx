import React from 'react'
import { screen } from '@testing-library/react'
import App from './App'
import { withMockFetch, renderWithRouter } from './components/testUtilities'

import {
  jaApiCalls,
  eaApiCalls,
} from './components/_mocks'

jest.unmock('react-toastify')

const apiMocks = {
  failedAuth: {
    url: '/api/me',
    response: { user: null, supportUser: null },
  },
}

const renderView = (route: string) => renderWithRouter(<App />, { route })

describe('App', () => {
  describe('/admin', () => {
    it('renders unauthenticated properly', async () => {
      const expectedCalls = [apiMocks.failedAuth]
      await withMockFetch(expectedCalls, async () => {
        const { container } = renderView('/admin')
        await screen.findByRole('button', { name: /Log in to your election/ })
      })
    })
    it('renders logged in ja properly', async () => {
      const expectedCalls = [jaApiCalls.getUser]
      await withMockFetch(expectedCalls, async () => {
        const { container } = renderView('/admin')
        expect(
          (await screen.findAllByAltText('Election Results Reporting, by VotingWorks')).length
        ).toBe(2)
        // Jurisdiction name
        await screen.findByText('jurisdictionadmin@email.org')
        // Jurisdiction admin screen title
        screen.findByText('Election wise Jurisdictions')
      })
    })
    it('renders logged in ea properly', async () => {
      const expectedCalls = [eaApiCalls.getUser]
      await withMockFetch(expectedCalls, async () => {
        const { container } = renderView('/admin')
        expect(
          (await screen.findAllByAltText('Election Results Reporting, by VotingWorks')).length
        ).toBe(2)
        // Jurisdiction name
        await screen.findByText('electionadmin@email.org')
        // Create new election title
        screen.findByText('Create new Election')
      })
    })
  })
})