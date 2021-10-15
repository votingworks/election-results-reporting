import React from 'react'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'
import AuthDataProvider from './UserContext'
import { renderWithRouter, withMockFetch } from './testUtilities'
import {
  eaApiCalls,
  apiCalls,
  jaApiCalls,
  supportApiCalls,
} from './_mocks'

const renderHeader = (route: string) =>
  renderWithRouter(
    <AuthDataProvider>
      <Header />
    </AuthDataProvider>,
    { route }
  )

describe('Header', () => {
  it('shows logo & admin login button when no authenticated user | Home screen', async () => {
    const expectedCalls = [apiCalls.unauthenticatedUser]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/')

      // Election Results Reporting logo
      const elrepLogo = await screen.findByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })
      expect(elrepLogo).toHaveAttribute('href', '/')
      expect(within(elrepLogo).getByRole('img')).toHaveAttribute(
        'src',
        '/elrep.png'
      )

      // Header should have admin login button when there's no authenticated user
      await screen.findByText('Admin Login')

      // There should only be 1 button and that would be Admin Login
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })
  })

  it('shows logo when no authenticated user | Admin screen', async () => {
    const expectedCalls = [apiCalls.unauthenticatedUser]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/admin')

      // Election Results Reporting logo
      const elrepLogo = await screen.findByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })
      expect(elrepLogo).toHaveAttribute('href', '/')
      expect(within(elrepLogo).getByRole('img')).toHaveAttribute(
        'src',
        '/elrep.png'
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('shows the authenticated user', async () => {
    const expectedCalls = [eaApiCalls.getUser]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/admin')

      // Elrep logo
      await screen.findByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })

      // User's email
      const userButton = screen.getByRole('button', {
        name: /electionadmin@email.org/,
      })
      userEvent.click(userButton)

      // Dropdown menu should show with log out option
      const logOutButton = screen.getByRole('link', { name: 'log-out Log out' })
      expect(logOutButton).toHaveAttribute('href', '/auth/logout')

      // There should only be 1 button after user log in
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })
  })

  it('shows logo & admin login button on server error | Home screen', async () => {
    const expectedCalls = [apiCalls.serverError('/api/me')]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/')

      // Election Results Reporting logo
      const elrepLogo = await screen.findByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })
      expect(elrepLogo).toHaveAttribute('href', '/')
      expect(within(elrepLogo).getByRole('img')).toHaveAttribute(
        'src',
        '/elrep.png'
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('shows jurisdiction admin email when authenticated | Admin screen', async () => {
    const expectedCalls = [jaApiCalls.getUser]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/admin')

      // Elrep logo
      await screen.findByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })

      // User's email
      const userButton = screen.getByRole('button', {
        name: /jurisdictionadmin@email.org/,
      })
      userEvent.click(userButton)

      // Dropdown menu should show with log out option
      const logOutButton = screen.getByRole('link', { name: 'log-out Log out' })
      expect(logOutButton).toHaveAttribute('href', '/auth/logout')

      // There should only be 1 button after user log in
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })
  })

  it('shows jurisdiction name & email when authenticated | Election results screen', async () => {
    const expectedCalls = [jaApiCalls.getUser]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/election/election-id-1/jurisdiction/jurisdiction-id-1/results')

      // Elrep logo
      await screen.findByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })

      // Jurisdiction name
      screen.getByText('Jurisdiction: Jurisdiction 1')

      // User's email
      const userButton = screen.getByRole('button', {
        name: /jurisdictionadmin@email.org/,
      })
      userEvent.click(userButton)

      // Dropdown menu should show with log out option
      const logOutButton = screen.getByRole('link', { name: 'log-out Log out' })
      expect(logOutButton).toHaveAttribute('href', '/auth/logout')

      // There should only be 1 button after user log in
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })
  })

  it('shows Support Tools navbar when authenticated as a support user', async () => {
    const expectedCalls = [supportApiCalls.getUser]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/support')

      // Support tools link
      const supportToolsLink = await screen.findByRole('link', {
        name: /Support Tools/,
      })
      expect(supportToolsLink).toHaveAttribute('href', '/support')

      // Support user email
      screen.getByText('support@example.com')

      // Log out button
      const logOutButton = screen.getByRole('link', { name: 'log-out Log out' })
      expect(logOutButton).toHaveAttribute('href', '/auth/support/logout')

      // No regular navbar
      expect(
        screen.queryByRole('link', {
          name: 'Election Results Reporting, by VotingWorks',
        })
      ).not.toBeInTheDocument()
    })
  })

  it('shows both navbars when a support user impersonates an election admin', async () => {
    const expectedCalls = [supportApiCalls.getUserImpersonatingEA]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/')

      // Support tools navbar

      // Support tools link
      const supportToolsLink = await screen.findByRole('link', {
        name: /Support Tools/,
      })
      expect(supportToolsLink).toHaveAttribute('href', '/support')

      // Support user email
      screen.getByText('support@example.com')

      // Log out button
      const logOutButton = screen.getByRole('link', { name: 'log-out Log out' })
      expect(logOutButton).toHaveAttribute('href', '/auth/support/logout')

      // Election admin navbar
      // Elrep logo
      screen.getByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })

      // User's email
      const userButton = screen.getByRole('button', {
        name: /electionadmin@email.org/,
      })
      userEvent.click(userButton)

      // Dropdown menu should show with log out option
      const aalogOutButton = screen.getAllByRole('link', { name: 'log-out Log out' })[1]
      expect(aalogOutButton).toHaveAttribute('href', '/auth/logout')
    })
  })

  it('shows both navbars when a support user impersonates a jurisdiction admin', async () => {
    const expectedCalls = [supportApiCalls.getUserImpersonatingJA]
    await withMockFetch(expectedCalls, async () => {
      renderHeader('/')

      // Support tools navbar

      // Support tools link
      const supportToolsLink = await screen.findByRole('link', {
        name: /Support Tools/,
      })
      expect(supportToolsLink).toHaveAttribute('href', '/support')

      // Support user email
      screen.getByText('support@example.com')

      // Log out button
      const logOutButton = screen.getByRole('link', { name: 'log-out Log out' })
      expect(logOutButton).toHaveAttribute('href', '/auth/support/logout')

      // Jurisdiction admin navbar
      // Elrep logo
      screen.getByRole('link', {
        name: 'Election Results Reporting, by VotingWorks',
      })

      // User's email
      const userButton = screen.getByRole('button', {
        name: /jurisdictionadmin@email.org/,
      })
      userEvent.click(userButton)

      // Dropdown menu should show with log out option
      const jalogOutButton = screen.getAllByRole('link', { name: 'log-out Log out' })[1]
      expect(jalogOutButton).toHaveAttribute('href', '/auth/logout')
    })
  })
})
