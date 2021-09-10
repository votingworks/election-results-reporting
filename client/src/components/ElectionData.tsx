import React, { useState, useEffect } from 'react'
import { useParams, Redirect } from  'react-router-dom'
import { Cell } from 'react-table'

import styled from 'styled-components'
import { Button, ButtonGroup, Icon, Intent, H4 } from '@blueprintjs/core'
import { Wrapper, Inner } from './Atoms/Wrapper'
import { Table } from './Atoms/Table'
import { useModal, Modal } from './Atoms/Modal'
import { useConfirm, Confirm } from './Atoms/Confirm'

import { IElectionAdmin, useAuthDataContext } from './UserContext'
import { IContest } from './ElectionContext'
import { api } from './utilities'


const DataTableWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
`
const TableWrapper = styled.div`
  overflow-x: auto;
  scrollbar-width: 2px;
  ::-webkit-scrollbar {
    height: 5px;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #e1e8ed; 
      border-radius: 10px;
  }
`
const SpacedButtonGroup = styled(ButtonGroup)`
  text-align: center;
  padding: 0 12px;
  *:not(:last-child){
    margin-right: 20px !important;
  }
`
const CongestedH4 = styled(H4)`
  margin: 0;
`
const CongestedP = styled.p`
  margin-bottom: 2px;
`
const TableDiv = styled.div`
  p {
    width: 100%;
    margin: 0;
    border-bottom: 1px solid;
    display: flex;
    flex-direction: row;
  }
  p:first-child {
    border-top: 1px solid;
  }
  p>span:first-child {
    width: 80%;
  }
  p>span:last-child {
    width: 20%;
    text-align: right;
  }
`

interface IParams {
  electionId: string;
  jurisdictionId: string;
}
interface IElectionData {
  id: number,
  jurisdictionName: string,
  fileName: string,
  createdAt: Date | null,
  source: string,
  status: string,
  totalBallotsCast: string;
  contests: IContest[]
}
interface IResponse {
  message: string;
  data: IElectionData[];
}

const DataTable = ({ user }: { user: IElectionAdmin }) => {
  const { electionId } = useParams<IParams>()
  const [ electionResultsData, setelectionResultsData ] = useState<IElectionData[]>([])
  const { modal, modalProps } = useModal()
  const { confirm, confirmProps } = useConfirm()

  // Init from Definition
  useEffect( () => {
    (async () => {
      const response = await api<IResponse>(`/election/${electionId}/data`, { method: 'GET' })
      if (response && response.message !== "No entry found!") {
        setelectionResultsData(response.data)
      } else {
        
      }
    })()
  }, [electionId])

  const onClickViewJurisdiction = (fileName: string, totalBallotsCast: string, contests: IContest[]) => {
    modal({
      title: (fileName),
      description: (
        <>
          {contests.map((contest)=>(
            <div key={contest.id}>
              <CongestedP>Town Name here</CongestedP>
              <CongestedH4>{contest.name}</CongestedH4>
              {/* Implement over and under votes formula */}
              <p>{totalBallotsCast} ballots cast / {contest.candidates.map(candidate => candidate.numVotes).reduce((prev, curr) => prev+parseInt(curr), 0)-parseInt(totalBallotsCast)/2} overvotes / {parseInt(totalBallotsCast)/2 - contest.candidates.map(candidate => candidate.numVotes).reduce((prev, curr) => prev+parseInt(curr), 0)} undervotes</p>
                  <TableDiv>
                  {contest.candidates.map((candidate)=>(
                    <p key={candidate.id}>
                      <span>{candidate.name}</span>
                      <span>{candidate.numVotes}</span>
                    </p>
                  ))}
                  </TableDiv><br/>
          </div>
          )
        )}
        </>
      )
    }
  )}

  const onClickReprocessJurisdiction = (id: number, jurisdictionName: string) => {
    confirm({
      title: 'Confirm',
      description: (
        <div>
          <p>Are you sure you want to reprocess {jurisdictionName}?</p>
        </div>
      ),
      yesButtonLabel: 'Reprocess',
      yesButtonIntent: Intent.SUCCESS,
      onYesClick: async () => alert('Reprocessed Successfully'),
    })
  }

  const onClickDeleteJurisdiction = (id: number, jurisdictionName: string) => {
    confirm({
      title: 'Confirm',
      description: (
        <div>
          <p>Are you sure you want to delete {jurisdictionName}?</p>
          <p>
            <strong>Warning: this action cannot be undone.</strong>
          </p>
        </div>
      ),
      yesButtonLabel: 'Delete',
      yesButtonIntent: Intent.DANGER,
      onYesClick: async () => alert('Deleted Successfully'),
    })
  }

  return (
    <DataTableWrapper>
      <h2>{user.organizations.map(organization => organization.elections.filter(election => election.id === electionId)[0])[0].electionName}</h2>
      <TableWrapper>
        <Table 
          data={electionResultsData}
          columns={[
            {
              Header: 'Jurisdiction Name',
              accessor: 'jurisdictionName'
            },
            {
              Header: 'File Name',
              accessor: 'fileName',
              disableSortBy: true
            },
            {
              Header: 'Created At',
              accessor: 'createdAt',
              Cell: ({value: createdAt}: Cell) => {
                return createdAt.toLocaleString();
              }
            },
            {
              Header: 'Source',
              accessor: 'source',
              disableSortBy: true
            },
            {
              Header: 'Status',
              accessor: 'status'
            },
            {
              Header: 'Actions',
              accessor: 'id',
              Cell: ({ row }: Cell) => {
                const currRow = electionResultsData.filter(data=>data.id === row.values.id)[0]
                return (
                  <SpacedButtonGroup>
                    <Button onClick={() => onClickViewJurisdiction(row.values.fileName, currRow.totalBallotsCast, currRow.contests)}>
                      <Icon icon="eye-open" intent={Intent.PRIMARY}></Icon>
                    </Button>
                    <Button onClick={() => onClickReprocessJurisdiction(row.values.id, row.values.jurisdictionName)}>
                      <Icon icon="repeat" intent={Intent.SUCCESS}></Icon>
                    </Button>
                    <Button onClick={() => onClickDeleteJurisdiction(row.values.id, row.values.jurisdictionName)}>
                      <Icon icon="trash" intent={Intent.DANGER}></Icon>
                    </Button>
                  </SpacedButtonGroup>
                )
              },
              disableSortBy: true
            },
          ]}
        />
      </TableWrapper>
      <Modal {...modalProps}></Modal>
      <Confirm {...confirmProps} />
    </DataTableWrapper>
  )
}

const ElectionData:React.FC = () => {
  const auth = useAuthDataContext()
  if (auth && (!auth.user || auth.user.type !== 'election_admin')) {
    return (
    <Redirect to="/admin" />
    )
  }
  if (!auth || !auth.user || auth.user.type!=='election_admin') return null
  const { user } = auth

  return (
    <Wrapper>
      <Inner>
        <DataTable user={user} />
      </Inner>
    </Wrapper>
  )
}

export default ElectionData