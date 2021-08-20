import React from 'react'
import { Cell } from 'react-table'
import styled from 'styled-components'
import { Button, ButtonGroup, Icon, Intent } from '@blueprintjs/core'
import LinkButton from './Atoms/LinkButton'
import { Wrapper, Inner } from './Atoms/Wrapper'
import { Table } from './Atoms/Table'
import { useConfirm, Confirm } from './Atoms/Confirm'

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

const ActionButton = styled(LinkButton)`
  width: 20px;
`

const DataTable = () => {
  const { confirm, confirmProps } = useConfirm()

  interface IElection {
    id: number,
    jurisdictionName: string,
    fileName: string,
    createdAt: Date | null,
    source: string,
    status: string
  }

  const tempData: IElection[] = [
    {
      id: 0,
      jurisdictionName: 'Adams County',
      fileName: 'Precinct1.elec',
      createdAt: new Date(),
      source: 'File',
      status: 'Ready'
    },
    {
      id: 1,
      jurisdictionName: 'Adams County',
      fileName: 'Precinct2.elec',
      createdAt: new Date(),
      source: 'Data Entry',
      status: 'Failed'
    },
    {
      id: 2,
      jurisdictionName: 'Archuleta County',
      fileName: 'Precinct 1 - EDay',
      createdAt: new Date(),
      source: 'Data Entry',
      status: 'Published'
    },
    {
      id: 3,
      jurisdictionName: 'Beaver Creek County',
      fileName: 'BeaverCreekPrecinct 1.txt',
      createdAt: new Date(),
      source: 'File',
      status: 'Published'
    }
  ]

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
      <h2>Sample Election</h2>
      <TableWrapper>
        <Table 
          data={tempData}
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
                return (
                  <SpacedButtonGroup>
                    <ActionButton to={`/election`}><Icon icon="eye-open" intent={Intent.PRIMARY}></Icon></ActionButton>
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
      <Confirm {...confirmProps} />
    </DataTableWrapper>
  )
}

const ElectionData:React.FC = () => {
  return (
    <Wrapper>
      <Inner>
        <DataTable />
      </Inner>
    </Wrapper>
  )
}

export default ElectionData