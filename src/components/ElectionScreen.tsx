import React from 'react'
import { HTMLSelect, ButtonGroup } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, FormikProps, Field } from 'formik'
import LinkButton from './Atoms/LinkButton'
import FormSection from './Atoms/Form/FormSection'
import FormButton from './Atoms/Form/FormButton'
import { Wrapper, Inner } from './Atoms/Wrapper'
import FormField from './Atoms/Form/FormField'
import CSVFile, { IFileInfo } from './CSVForm/index'

const activeElections = [
  {
    id: 0,
    electionName: 'Election 1',
    electionDate: new Date(),
    pollsOpen: new Date().getHours()+':'+new Date().getMinutes(),
    pollsClose: (new Date().getHours()+3)+':'+new Date().getMinutes(),
    timezone: 'CST',
    certificationDate: new Date(),
    participatingJursidiction: null,
    electionDefinition: null,
  },
  {
    id: 1,
    electionName: 'Sample Election 2',
    electionDate: new Date(),
    pollsOpen: new Date().getHours()+':'+new Date().getMinutes(),
    pollsClose: (new Date().getHours()+3)+':'+new Date().getMinutes(),
    timezone: 'UTC',
    certificationDate: new Date(),
    participatingJursidiction: null,
    electionDefinition: null,
  },
  {
    id: 2,
    electionName: 'Sample 3',
    electionDate: new Date(),
    pollsOpen: new Date().getHours()+':'+new Date().getMinutes(),
    pollsClose: (new Date().getHours()+3)+':'+new Date().getMinutes(),
    timezone: 'IST',
    certificationDate: new Date(),
    participatingJursidiction: null,
    electionDefinition: null,
  }
]

const CreateElectionWrapper = styled.div`
  background-color: #ebf1f5;
  padding: 30px;
`

const ActiveElectionsWrapper = styled.div`
  padding: 30px;
`

const WideField = styled(FormField)`
  width: 100%;
`

const InlineField = styled(FormField)`
  width: 100%;
  padding-right: 12px;
`

const Select = styled(HTMLSelect)`
  margin-top: 5px;
`

interface IValues {
  electionName: string
  electionDate: Date | string
  pollsOpen: TimeRanges | string
  pollsClose: TimeRanges | string
  timezone: string
  certificationDate: Date | string
  participatingJurisdictions: File | null
  electionDefinition: File | null
}

const CreateElection: React.FC = () => {
  const InlineLabel = styled.label`
    display: inline-flex;
    flex-wrap: wrap;
    width: 33.33%;

    @media only screen and (max-width: 767px) {
      width: 100%;
    }
  `

  const jurisdictionsFile: IFileInfo = {
    file: null,
    processing: null,
  }

  const electionDefinition: IFileInfo = {
    file: null,
    processing: null,
  }

  return (
    <Formik
      onSubmit={() => console.log('submitted')}
      initialValues={{
        electionName: '',
        electionDate: '',
        pollsOpen: '',
        pollsClose: '',
        timezone: '',
        certificationDate: '',
        participatingJurisdictions: null,
        electionDefinition: null,
      }}
    >
      {({ setFieldValue, setValues, values }: FormikProps<IValues>) => (
        <CreateElectionWrapper>
          <h2>Create New Election</h2>
          <FormSection>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="electionName">
              <p>Election name</p>
              <Field
                id="electionName"
                name="electionName"
                type="text"
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection>
          <FormSection>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="electionDate">
              <p>Election date</p>
              <Field
                id="electionDate"
                name="electionDate"
                type="date"
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection>
          <FormSection>
            <InlineLabel htmlFor="pollsOpen">
              <p>Polls open</p>
              <Field
                id="pollsOpen"
                name="pollsOpen"
                type="time"
                validate={(v: string) => (v ? undefined : 'Required')}
                component={InlineField}
              />
            </InlineLabel>
            <InlineLabel htmlFor="pollsClose">
              <p>Polls close</p>
              <Field
                id="pollsClose"
                name="pollsClose"
                type="time"
                validate={(v: string) => (v ? undefined : 'Required')}
                component={InlineField}
              />
            </InlineLabel>
            <InlineLabel htmlFor="timezone">
              <p>Timezone</p>
              <Field
                id="timezone"
                name="timezone"
                type="text"
                validate={(v: string) => (v ? undefined : 'Required')}
                placeholder="CST"
                component={WideField}
              />
            </InlineLabel>
          </FormSection>
          <FormSection>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="certificationDate">
              <p>Certification Date</p>
              <Field
                id="certificationDate"
                name="certificationDate"
                type="date"
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection>
          <FormSection>
            <CSVFile
              csvFile={jurisdictionsFile}
              uploadCSVFile={() => Promise.resolve(true)}
              title="Participating Jurisdictions"
              description=""
              sampleFileLink=""
              enabled
            />
          </FormSection>
          <FormSection>
            <CSVFile
              csvFile={electionDefinition}
              uploadCSVFile={() => Promise.resolve(true)}
              title="Election Definition"
              description=""
              sampleFileLink=""
              enabled
            />
          </FormSection>
          <FormButton type="submit" intent="primary" fill large>
            Create new election
          </FormButton>
        </CreateElectionWrapper>
      )}
    </Formik>

  )
}

const ActiveElections = () => {
  return (
    <ActiveElectionsWrapper>
      <h2>Active Elections</h2>
      {activeElections.length === 0 ? (
        <p>You haven&apos;t created any elections yet</p>
      ) : (
        activeElections.map((elec) => (
          <ButtonGroup
            key={elec.id}
            fill
            large
            style={{ marginBottom: '15px' }}
          >
            <LinkButton
              style={{ justifyContent: 'start' }}
              to="#"
              intent="primary"
              fill
            >
              {elec.electionName}
            </LinkButton>
          </ButtonGroup>
        ))
      )}
    </ActiveElectionsWrapper>
  )
}

const ElectionScreen: React.FC = () => {
  return (
    <Wrapper>
      <Inner>
        <div style={{ width: '50%' }}>
          <CreateElection />
        </div>
        <div style={{ width: '50%' }}>
          <ActiveElections />
        </div>
      </Inner>
    </Wrapper>
  )
}

export default ElectionScreen