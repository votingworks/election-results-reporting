import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import * as Yup from 'yup'

import { toast } from 'react-toastify'
import { ButtonGroup, FileInput, Callout } from '@blueprintjs/core'
import styled from 'styled-components'

import { Formik, FormikProps, Field } from 'formik'
import LinkButton from './Atoms/LinkButton'
import FormSection from './Atoms/Form/FormSection'
import FormButton from './Atoms/Form/FormButton'
import { ErrorLabel } from './Atoms/Form/_helpers'
import FormField from './Atoms/Form/FormField'

import { Wrapper, Inner } from './Atoms/Wrapper'
import { groupBy, sortBy } from '../utils/array'
import { api } from './utilities'

import {
  useAuthDataContext,
  IElectionAdmin,
  IElection,
  IJurisdictionAdmin
} from './UserContext'
import timezoneDict from '../data/timezone.json'


const ResponsiveInner = styled(Inner)`
  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
  }
  @media only screen and (min-width: 1440px) {
    min-width: 100vw;
    padding: 1% 20% 0 20%;
  }
`

const AdminScreen: React.FC = () => {
  const auth = useAuthDataContext()

  if (auth === null) return null // Still loading

  const { user } = auth
  if (!user) return null

  switch (user.type) {
    case 'election_admin':
      return (
        <Wrapper>
          <ResponsiveInner>
            <CreateElection user={user} />
            <ActiveElections user={user} />
          </ResponsiveInner>
        </Wrapper>
      )
    case 'jurisdiction_admin': {
      if (user.jurisdictions.length === 1) {
        const electionId = user.jurisdictions[0].election.id
        const jurisdictionId = user.jurisdictions[0].id
        return (
          <Redirect
            to={`election/${electionId}/jurisdiction/${jurisdictionId}/results`}
          />
        )
      }

      return (
        <Wrapper>
          <ResponsiveInner>
              <ListElectionsJurisdictionAdmin user={user} />
          </ResponsiveInner>
        </Wrapper>
      )
    }
    default:
      /* istanbul ignore next */
      return null // Shouldn't happen
  }
}

export default AdminScreen


const CreateElectionWrapper = styled.div`
  width: 100%;
  background-color: #ebf1f5;
  padding: 30px;
`

const WideField = styled(FormField)`
  width: 100%;
`

const InlineFormField = styled(FormField)`
  width: 100%;
  padding-right: 12px;
`

const InlineLabel = styled.label`
  display: inline-flex;
  flex-wrap: wrap;
  width: 33.33%;

  @media only screen and (max-width: 767px) {
    width: 100%;
  }
`

const CreateElection = ({ user }: { user: IElectionAdmin }) => {
  const [submitting, setSubmitting] = useState(false)

  interface ITimezone {
    [key: string]: string;
  }
  const timezones:ITimezone = timezoneDict
  const usrTz: string = Intl.DateTimeFormat().resolvedOptions().timeZone

  interface IObjectIterableValues extends IElection {
    readonly [key: string]: any;
  }

  const onSubmit = async (newElection: IObjectIterableValues) => {
    setSubmitting(true)
    const formData: FormData = new FormData()
    const datetimeFields = ['pollsOpen', 'pollsClose']
    const fileFields = ['jurisdictions', 'electionDefinition']

    for (const key in newElection) {
      if (datetimeFields.includes(key)) {
        formData.append(
          key,
          new Date(`${newElection.electionDate}T${newElection[key]}`).toString().split("(")[0].trim()
        )
      } else if (fileFields.includes(key)) {
        formData.append(
          key, 
          newElection[key] as Blob,
          ( (newElection[key] && newElection[key].name ) ? newElection[key].name : undefined )
        )
      } else {
        if (key !== 'certificationDate' && key !== 'electionDate') {
          formData.append(key, newElection[key])
        } else {
          formData.append(
            'certificationDate',
            new Date(`${newElection.certificationDate}T00:00:00`).toString().split("(")[0].trim()
          )
        }
      }
    }

    const response: { status: string, electionId: string } | null = await api('/election', {
      method: 'POST',
      body: formData
    })
    if (response && response.status === 'ok') {
      window.location.reload()
    } else {
      setSubmitting(false)
      toast.error("Err, Couldn't create election! Try Again")
    }
  }

  const electionSchema = Yup.object().shape({
    electionName: Yup.string().required('Required'),
    electionDate: Yup.string().required('Required'),
    pollsOpen: Yup.string().required('Required'),
    pollsClose: Yup.string().required('Required'),
    pollsTimezone: Yup.string().required('Required'),
    certificationDate: Yup.string().required('Required'),
    jurisdictions: Yup.mixed().required('File required'),
    definition: Yup.mixed().required('File required'),
  })

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        id: '',
        electionName: '',
        organizationId: user.organizations[0].id,
        electionDate: '',
        pollsOpen: '',
        pollsClose: '',
        pollsTimezone: timezones[`${usrTz}`] ? timezones[`${usrTz}`] : '',
        certificationDate: '',
        jurisdictions: null,
        definition: null,
      }}
      validationSchema={electionSchema}
    >
      {({ 
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched
      }: FormikProps<IElection>) => (
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
                component={InlineFormField}
              />
            </InlineLabel>
            <InlineLabel htmlFor="pollsClose">
              <p>Polls close</p>
              <Field
                id="pollsClose"
                name="pollsClose"
                type="time"
                component={InlineFormField}
              />
            </InlineLabel>
            <InlineLabel htmlFor="pollsTimezone">
              <p>Timezone</p>
              <Field
                id="pollsTimezone"
                name="pollsTimezone"
                type="text"
                placeholder="CST"
                component={WideField}
              />
            </InlineLabel>
          </FormSection>
          <FormSection>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="certificationDate">
              <p>Certification date</p>
              <Field
                id="certificationDate"
                name="certificationDate"
                type="date"
                component={WideField}
              />
            </label>
          </FormSection>
          <FormSection>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="jurisdictions">
              <p>Participating jurisdictions</p>
              <FileInput
                inputProps={{
                  accept: '.csv',
                  name: 'jurisdictions',
                }}
                onInputChange={e => {
                  setFieldValue(
                    'jurisdictions',
                    (e.currentTarget.files && e.currentTarget.files[0]) ||
                      undefined
                  )
                }}
                hasSelection={!!values.jurisdictions}
                text={values.jurisdictions ? values.jurisdictions.name : 'Select a CSV...'}
                disabled={submitting}
                fill
              />
               { errors.jurisdictions && touched.jurisdictions && (
                  <ErrorLabel>{errors.jurisdictions}</ErrorLabel>
                )}
            </label>
          </FormSection>
          <FormSection>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="definition">
              <p>Election definition</p>
              <FileInput
                inputProps={{
                  accept: '.json',
                  name: 'definition',
                }}
                onInputChange={e => {
                  setFieldValue(
                    'definition',
                    (e.currentTarget.files && e.currentTarget.files[0]) ||
                      undefined
                  )
                }}
                hasSelection={!!values.definition}
                text={values.definition ? values.definition.name : 'Select a JSON...'}
                disabled={submitting}
                fill
              />
               { errors.definition && touched.definition && (
                  <ErrorLabel>{errors.definition}</ErrorLabel>
                )}
            </label>
          </FormSection>
          <FormButton
            type="button"
            intent="primary"
            fill
            large
            onClick={handleSubmit}
            loading={submitting}
          >
            Create New Election
          </FormButton>
        </CreateElectionWrapper>
      )}
    </Formik>

  )
}

const ActiveElectionsWrapper = styled.div`
  width: 100%;
  padding: 30px;
`

const ActiveElections = ({ user }: { user: IElectionAdmin }) => {
  return (
    <ActiveElectionsWrapper>
      <h2>Active Elections</h2>
      {sortBy(user.organizations, o => o.name).map(organization => (
        <div key={organization.id}>
          <h4>{organization.name}</h4>
          {organization.elections.length === 0 ? (
            <p>
              You haven&apos;t created any elections yet for {organization.name}
            </p>
          ) : (
            sortBy(organization.elections, e => e.electionName).map(election => (
              <ButtonGroup
                key={election.id}
                fill
                large
                style={{ marginBottom: '15px' }}
              >
                <LinkButton
                  style={{ justifyContent: 'start' }}
                  to={`/election/${election.id}/data`}
                  intent='primary'
                  fill
                >
                  {election.electionName}
                </LinkButton>
              </ButtonGroup>
            ))
          )}
        </div>
      ))}
    </ActiveElectionsWrapper>
  )
}

const JurisdictionElectionListWrapper = styled.div`
  width: 50%;
  padding: 30px;
  @media only screen and (max-width: 767px) {
    width: 100%;
  }
`

const ListElectionsJurisdictionAdmin = ({ user }: { user: IJurisdictionAdmin }) => {
  const jurisdictionsByElection = groupBy(user.jurisdictions, j => j.election.id)

  return (
    <JurisdictionElectionListWrapper>
      <h2>Election wise Jurisdictions</h2>
      {Object.entries(jurisdictionsByElection).length === 0 ? (
        <Callout intent="warning">
          You don&apos;t have any available elections at the moment
        </Callout>
      ) : (
        sortBy(
          Object.entries(jurisdictionsByElection),
          ([_, jurisdictions]) => jurisdictions[0].election.electionName
        ).map(([electionId, jurisdictions], i: number) => (
          <div key={electionId}>
            <h2>{`${jurisdictions[0].election.electionName}-`}</h2>
            {sortBy(jurisdictions, j => j.name).map(
              ({ id, name, election }) => (
                <LinkButton
                  key={id}
                  to={`/election/${election.id}/jurisdiction/${id}/results`}
                  intent="primary"
                  large
                  fill
                  style={{
                    justifyContent: 'start',
                    marginBottom: '15px',
                  }}
                >
                  {name}
                </LinkButton>
              )
            )}
          </div>
        ))
      )}
    </JurisdictionElectionListWrapper>
  )
}
