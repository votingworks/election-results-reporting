import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { ButtonGroup, FileInput } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, FormikProps, Field } from 'formik'
import LinkButton from './Atoms/LinkButton'
import FormSection from './Atoms/Form/FormSection'
import FormButton from './Atoms/Form/FormButton'
import { ErrorLabel } from './Atoms/Form/_helpers'
import { Wrapper, Inner } from './Atoms/Wrapper'
import FormField from './Atoms/Form/FormField'
import { sortBy } from '../utils/array'
import { api } from './utilities'
import {
  useAuthDataContext,
  IAdmin,
  IElection
} from './UserContext'

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

const CreateElection = ({ user }: { user: IAdmin }) => {
  const [submitting, setSubmitting] = useState(false)

  interface IObjectIterableValues extends IElection {
    readonly [key: string]: any;
  }

  const onSubmit = async (newElection: IObjectIterableValues) => {
    setSubmitting(true)
    const formData: FormData = new FormData()

    for (const key in newElection) {
      if (key !== 'jurisdictions' && key!=='electionDefinition' ) {
        formData.append(key, newElection[key])
      }
    }
    formData.append(
      'jurisdictions', 
      newElection.jurisdictions as Blob,
      ( (newElection.jurisdictions && newElection.jurisdictions.name ) ? newElection.jurisdictions.name : undefined )
    )

    const response: { status: string } | null = await api('/election', {
      method: 'POST',
      body: formData
    })
    if (response && response.status === 'ok') {
      // if response refresh page
      window.location.reload()
    } else {
      setSubmitting(false)
      toast.error("Err, Couldn't create election! Try Again")
    }
  }

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
        pollsTimezone: '',
        certificationDate: '',
        jurisdictions: null,
        electionDefinition: null,
      }}
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
                component={InlineFormField}
              />
            </InlineLabel>
            <InlineLabel htmlFor="pollsClose">
              <p>Polls close</p>
              <Field
                id="pollsClose"
                name="pollsClose"
                type="time"
                validate={(v: string) => (v ? undefined : 'Required')}
                component={InlineFormField}
              />
            </InlineLabel>
            <InlineLabel htmlFor="pollsTimezone">
              <p>Timezone</p>
              <Field
                id="pollsTimezone"
                name="pollsTimezone"
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
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="jurisdictions">
              <p>Participating Jurisdictions</p>
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
                // disabled={isSubmitting || isProcessing || !enabled}
                fill
              />
               { errors.jurisdictions && touched.jurisdictions && (
                  <ErrorLabel>{errors.jurisdictions}</ErrorLabel>
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

const ActiveElections = ({ user }: { user: IAdmin }) => {
  return (
    <ActiveElectionsWrapper>
      <h2>Active Elections</h2>
      {sortBy(user.organizations, o => o.name).map(organization => (
        <div key={organization.id}>
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
                  to='#'
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

const ElectionScreen: React.FC = () => {
  const auth = useAuthDataContext()

  if (auth === null || auth.user === null) return null // Still loading

  if (auth.user && auth.user.type !== 'admin') {
    return null
  }

  const { user } = auth

  return (
    <Wrapper>
      <ResponsiveInner>
        <CreateElection user={ user } />
        <ActiveElections user={ user } />
      </ResponsiveInner>
    </Wrapper>
  )
}

export default ElectionScreen