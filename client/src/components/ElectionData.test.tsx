import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withMockFetch, renderWithRouter } from './testUtilities'
import App from '../App'
import {
  eaApiCalls,
  apiCalls
} from './_mocks'

const renderView = (route: string) => renderWithRouter(<App />, { route })

describe('Election Data screen', () => {
  it('shows a login screen for unauthenticated users', async () => {
    const expectedCalls = [apiCalls.unauthenticatedUser]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/data')
      await screen.findByRole('img', { name: 'Election Results Reporting, by VotingWorks' })
      const jaLoginButton = screen.getByRole('button', {
        name: 'Log in to your election',
      })
      expect(jaLoginButton).toHaveAttribute(
        'href',
        '/auth/jurisdictionadmin/start?redirectOnSucess=/election/election-id-1/data'
      )
      const eaLoginButton = screen.getByRole('link', {
        name: 'Log in as an admin',
      })
      expect(eaLoginButton).toHaveAttribute(
        'href',
        '/auth/electionadmin/start?redirectOnSucess=/election/election-id-1/data'
      )
    })
  })

  it('shows election name as heading and table with no records', async () => {
    const expectedCalls = [
      eaApiCalls.getUserWithElection,
      eaApiCalls.getElectionResultsWithNoRows
    ]
    await withMockFetch(expectedCalls, async () => {
      const { container } = renderView('/election/election-id-1/data')

      await screen.findByRole('heading', { name: 'Election 1' })

      // There should be ONLY 1 table element
      const cols = ['Jurisdiction Name', 'File Name', 'Created At', 'Source', 'Actions']

      const table = await screen.findAllByRole('table')
      expect(table).toHaveLength(1)

      // The table should have ONLY 1 thead element
      const thead = table[0].getElementsByTagName('thead')
      expect(thead).toHaveLength(1);   
      // The number of th tags should be equal to number of columns
      const headers = await screen.findAllByRole('columnheader')
      expect(headers).toHaveLength(cols.length)
      // Each th tag text should equal to column header
      headers.forEach((th, idx) => {
        expect(th).toHaveAttribute("title", cols[idx])
      })

      // The table should have ONLY 1 tbody tag
      const tbody = table[0].getElementsByTagName('tbody')
      expect(tbody).toHaveLength(1)

      // There should be ONLY one table row
      const rows = tbody[0].getElementsByTagName('tr')
      expect(rows).toHaveLength(1)
      // The table row should have ONLY one cell
      const rowCells = rows[0].getElementsByTagName('td')
      expect(rowCells).toHaveLength(1)
      // The cell should have colSpan that is equal to the number of columns
      expect(rowCells[0]).toHaveAttribute('colSpan', `${cols.length}`)
      // Check cell text
      expect(rowCells[0]).toHaveTextContent('No Data Found')
    })
  })

  it('shows election name as heading and table with 1 record', async () => {
    const expectedCalls = [
      eaApiCalls.getUserWithElection,
      eaApiCalls.getElectionResultsWith1Row
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/data')

      await screen.findByRole('heading', { name: 'Election 1' })

      // There should be ONLY 1 table element
      const cols = ['Jurisdiction Name', 'File Name', 'Created At', 'Source', 'Actions']
      const rowData = ['Jurisdiction 1', 'File 1', 'Tue, 19 Oct 2021 16:55:49 GMT', 'Data Entry', /eye-open/]

      const table = await screen.findAllByRole('table')
      expect(table).toHaveLength(1)

      // The table should have ONLY 1 thead element
      const thead = table[0].getElementsByTagName('thead')
      expect(thead).toHaveLength(1)
      // The number of th tags should be equal to number of columns
      const headers = await screen.findAllByRole('columnheader')
      expect(headers).toHaveLength(cols.length)
      // Each th tag text should equal to column header
      headers.forEach((th, idx) => {
        expect(th).toHaveAttribute("title", cols[idx])
      })

      // The table should have ONLY 1 tbody tag
      const tbody = table[0].getElementsByTagName('tbody')
      expect(tbody).toHaveLength(1)

      // There should be ONLY one table row
      const rows = tbody[0].getElementsByTagName('tr')
      expect(rows).toHaveLength(1)
      // The table row should have 5 cells
      const rowCells = rows[0].getElementsByTagName('td')
      expect(rowCells).toHaveLength(cols.length)
      // Check cell text
      Array.from(rowCells).forEach((rowCell, idx) => {
        expect(rowCell).toHaveTextContent(rowData[idx])
      })
    })
  })

  it('shows election name as heading and table with multiple records', async () => {
    const expectedCalls = [
      eaApiCalls.getUserWithElection,
      eaApiCalls.getElectionResultsWithMultipleRows
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/data')

      await screen.findByRole('heading', { name: 'Election 1' })

      // There should be ONLY 1 table element
      const cols = ['Jurisdiction Name', 'File Name', 'Created At', 'Source', 'Actions']
      const rowData = [
        ['Jurisdiction 1', 'File 1', 'Tue, 19 Oct 2021 16:55:49 GMT', 'Data Entry', /eye-open/],
        ['Jurisdiction 2', 'File 2', 'Wed, 20 Oct 2021 15:41:24 GMT', 'Data Entry', /eye-open/]
      ]

      const table = await screen.findAllByRole('table')
      expect(table).toHaveLength(1)

      // The table should have ONLY 1 thead element
      const thead = table[0].getElementsByTagName('thead')
      expect(thead).toHaveLength(1)
      // The number of th tags should be equal to number of columns
      const headers = await screen.findAllByRole('columnheader')
      expect(headers).toHaveLength(cols.length)
      // Each th tag text should equal to column header
      headers.forEach((th, idx) => {
        expect(th).toHaveAttribute("title", cols[idx])
      })

      // The table should have ONLY 1 tbody tag
      const tbody = table[0].getElementsByTagName('tbody')
      expect(tbody).toHaveLength(1)

      // There should be ONLY 2 table row
      const rows = tbody[0].getElementsByTagName('tr')
      expect(rows).toHaveLength(2)

      // Check cell text for all rows
      Array.from(rows).forEach((row, idx) => {
        // The table row should have 5 cells
        const rowCells = row.getElementsByTagName('td')
        expect(rowCells).toHaveLength(cols.length)
        Array.from(rowCells).forEach((rowCell, jdx) => {
          expect(rowCell).toHaveTextContent(rowData[idx][jdx])
        })
      })
    })
  })

  it('shows table with 1 record, open/close modal buttons and check its contents', async () => {
    const expectedCalls = [
      eaApiCalls.getUserWithElection,
      eaApiCalls.getElectionResultsWith1Row
    ]
    await withMockFetch(expectedCalls, async () => {
      renderView('/election/election-id-1/data')

      // There should be ONLY 1 table element
      const cols = ['Jurisdiction Name', 'File Name', 'Created At', 'Source', 'Actions']
      const rowData = ['Jurisdiction 1', 'File 1', 'Tue, 19 Oct 2021 16:55:49 GMT', 'Data Entry', /eye-open/]

      const table = await screen.findAllByRole('table')
      expect(table).toHaveLength(1)

      // The table should have ONLY 1 thead element
      const thead = table[0].getElementsByTagName('thead')
      expect(thead).toHaveLength(1)
      // The number of th tags should be equal to number of columns
      const headers = await screen.findAllByRole('columnheader')
      expect(headers).toHaveLength(cols.length)
      // Each th tag text should equal to column header
      headers.forEach((th, idx) => {
        expect(th).toHaveAttribute("title", cols[idx])
      })

      // The table should have ONLY 1 tbody tag
      const tbody = table[0].getElementsByTagName('tbody')
      expect(tbody).toHaveLength(1)

      // There should be ONLY one table row
      const rows = tbody[0].getElementsByTagName('tr')
      expect(rows).toHaveLength(1)
      // The table row should have 5 cells
      const rowCells = rows[0].getElementsByTagName('td')
      expect(rowCells).toHaveLength(cols.length)
      // Check cell text
      Array.from(rowCells).forEach((rowCell, idx) => {
        expect(rowCell).toHaveTextContent(rowData[idx])
      })

      // Click modal eye button to open
      const modalOpenButton = await screen.findByRole('button', { name: /eye-open/ })
      userEvent.click(modalOpenButton)

      // Modal heading should be same file name
      expect(await screen.findByRole('heading', { name: 'File 1' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Contest 1' })).toBeInTheDocument()
      expect(screen.getByText('12 ballots cast')).toBeInTheDocument()
      expect(screen.getByText('Candidate 1')).toBeInTheDocument()
      expect(screen.getByText('Write-in')).toBeInTheDocument()

      // Modal close button
      const modalCloseButton = await screen.findByRole('button', { name: "Close" })
      expect(modalCloseButton).toBeInTheDocument()
    })
  })
})