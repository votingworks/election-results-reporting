import React, { useEffect, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'

import { HTMLSelect } from '@blueprintjs/core'
import styled from 'styled-components'
import { Wrapper, Inner } from './Atoms/Wrapper'

import { Formik, FormikProps, Field, FieldArray, ErrorMessage } from 'formik'
import FormSection from './Atoms/Form/FormSection'
import FormButton from './Atoms/Form/FormButton'
import FormField from './Atoms/Form/FormField'
import { ErrorLabel } from './Atoms/Form/_helpers'
import CSVFile, { IFileInfo } from './CSVForm/index'

import { IJurisdiction, useAuthDataContext } from './UserContext'

import { api, testNumber } from './utilities'


const resultsDataFile: IFileInfo = {
  file: null,
  processing: null,
}


const UploadResultsDataWrapper = styled.div`
  width: 100%;
  padding: 30px;
`


const ResultsDataUpload = () => {
  return (
    <UploadResultsDataWrapper>
      <h2>Upload Results Data</h2>
      <FormSection>
        <CSVFile
          csvFile={resultsDataFile}
          uploadCSVFile={() => Promise.resolve(true)}
          title=""
          description=""
          sampleFileLink=""
          enabled
        />
      </FormSection>
    </UploadResultsDataWrapper>
  );
}

const ResultsDataFormWrapper = styled.div`
  width: 100%;
  background-color: #ebf1f5;
  padding: 30px;
`

const WideField = styled(FormField)`
  width: 100%;
`

const SpacedDiv = styled.div`
  margin: 20px auto;
`

const Select = styled(HTMLSelect)`
  // margin-left: 5px;
  width: 100%;
`

const AddButton = styled(FormButton)`
  font-size: 24px;
  font-weight: bold;
  padding: 0 0 4px 0;
`


interface IParams {
  electionId: string;
  jurisdictionId: string;
}

interface ICandidate {
  id: string;
  name: string;
  numVotes: string;
}

interface IContest {
  id: string;
  title: string;
  districtId: string;
  allowWriteIns?: Boolean;
  totalBallotsCast?: string;
  candidates: ICandidate[]
}

interface IPrecinct {
  id: string;
  name: string;
}

interface IDistrict {
  id: string;
  name: string;
}

interface IBallotType {
  id: string;
  name?: string;
  precincts: IPrecinct['id'][];
  districts: IDistrict['id'][];
}

interface IDefinition {
  readonly contests: IContest[];
  readonly districts: IDistrict[];
  readonly precincts: IPrecinct[];
  readonly ballotTypes?: IBallotType[];
}

interface IElectionResult {
  jurisdictionId: IJurisdiction['id']
  precinct: IPrecinct['id'];
  ballotType?: IBallotType['id'];
  totalBallotsCast: IContest['totalBallotsCast'];
  contests: {
    id: IContest['id'];
    candidates: ICandidate[];
  }[];
}

const ResultsDataForm = () => {
  const { electionId, jurisdictionId } = useParams<IParams>()
  const [ electionDefinition, setElectionDefinition ] = useState<IDefinition | null>(null)

  const [submitting, setSubmitting] = useState(false)

  // Init Definition
  useEffect( () => {
    (async () => {
      const response = await api<IDefinition>(`/election/${electionId}/definition/file`, { method: 'GET' })
      setElectionDefinition(response)
    })()
  }, [electionId])

  const dummyContests = [
    {
      id: '',
      candidates: []
    },
  ]

  const populateCandidates = (selectedContestId: string) => {
    const contestCandidates: ICandidate[] = []
    if (selectedContestId && electionDefinition) {
      const contestData = electionDefinition.contests.filter((contest:IContest) => contest.id===selectedContestId)[0]
      Array.prototype.push.apply(contestCandidates, contestData.candidates.map((candidate: ICandidate) => {
        return ({id: candidate.id, name: candidate.name, numVotes: ''})
      }))
      if (contestData.allowWriteIns) {
        contestCandidates.push({id: `${contestData.candidates.length}`, name: 'Write-in', numVotes: ''})
      }
    } else {
      contestCandidates.push({id: '', name: '', numVotes: ''})
    }
    return contestCandidates
  }

  const onSubmit = async (electionResultsData: IElectionResult) => {
    setSubmitting(true)
    console.log(electionResultsData)
    setSubmitting(false)
  }

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        jurisdictionId: `${jurisdictionId}`,
        precinct: '',
        totalBallotsCast: '0',
        contests: dummyContests,
      }}
    >
      {({ handleSubmit, setFieldValue, setValues, values }: FormikProps<IElectionResult>) => (
        <ResultsDataFormWrapper>
          <h2>Election Results Data</h2>
          <FormSection>
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <label htmlFor="precinct">
              <p>Precinct Name</p>
              <div>
                <Field
                  component={Select}
                  id="precinct"
                  name="precinct"
                  onChange={(e: React.FormEvent<HTMLSelectElement>) =>
                    setFieldValue('precinct', e.currentTarget.value)
                  }
                  value={values.precinct}
                  options={[ ...((electionDefinition && electionDefinition.precincts) ? 
                    [{ value: '', label: 'Choose' }, ...electionDefinition.precincts.map(precinct=>({value: precinct.id, label: precinct.name}))] : 
                    [{ value: '', label: 'Choose' }])
                  ]}
                />
                <ErrorMessage name="precinct" component={ErrorLabel} />
              </div>
            </label>
          </FormSection>
          {/* Add this later */}
          {/* <FormSection> */}
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            {/* <label htmlFor="ballotType">
              <p>Ballot Type</p>
              <div>
                <Field
                  component={Select}
                  id="ballotType"
                  name="ballotType"
                  onChange={(e: React.FormEvent<HTMLSelectElement>) =>
                    setFieldValue('ballotType', e.currentTarget.value)
                  }
                  value={values.ballotType}
                  options={[ ...((electionDefinition && electionDefinition.ballotTypes) ?
                    [{ value: '', label: 'Choose' }, ...electionDefinition.ballotTypes.filter(ballotType=>ballotType.precincts.includes(values.precinct)).map(ballotType=>({value: ballotType.id, label: `Ballot ${ballotType.id}`}))] :
                    [{ value: '', label: 'Choose' }])
                  ]}
                />
              <ErrorMessage name="ballotType" component={ErrorLabel} />
              </div>
            </label>
          </FormSection> */}
          <FormSection>
            <label htmlFor="totalBallotsCast">
              Total Ballots Cast
              {/* istanbul ignore next */}
              <Field
                id="totalBallotsCast"
                name="totalBallotsCast"
                validate={testNumber()}
                value={values.totalBallotsCast}
                component={WideField}
              />
            </label>
          </FormSection>

          <FieldArray
            name="contests"
            render={contestsArrayHelpers => (
              <SpacedDiv>
                <h3>Vote Totals</h3>
                {values.contests.map((contest, i: number) => {
                  return (
                    <div key={contest.id}>
                      <FormSection>
                        {/* eslint-disable jsx-a11y/label-has-associated-control */}
                        <label htmlFor={`contests[${i}].id`}>
                        <p>Contest [{i+1}]</p>
                          <div>
                            <Field
                              component={Select}
                              id={`contests[${i}].id`}
                              name={`contests[${i}].id`}
                              onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                                setFieldValue(`contests[${i}].id`, e.currentTarget.value)
                                setFieldValue(`contests[${i}].candidates`, populateCandidates(e.currentTarget.value))
                              }}
                              value={values.contests[i].id}
                              options={[...((values.precinct && electionDefinition && electionDefinition.contests) ?
                                [{ value: '', label: 'Choose' }, ...electionDefinition.contests.map(contest=>({value: contest.id, label: contest.title}))] :
                                [{ value: '', label: 'Choose' }])
                              ]}
                            />
                            <ErrorMessage name={`contests[${i}].id`} component={ErrorLabel} />
                          </div>
                        </label>
                      </FormSection>
                      <FormSection>
                        { values.contests[i].id && values.contests[i].candidates.map((candidate: ICandidate, j: number) => {
                          return (
                            <FormSection key={`${contest.id} - ${candidate.id}`}>
                              <label htmlFor={`contests[${i}].candidates[${j}].id`}>
                                {candidate.name}
                                {/* istanbul ignore next */}
                                <Field
                                  id={`contests[${i}].candidates[${j}].numVotes`}
                                  name={`contests[${i}].candidates[${j}].numVotes`}
                                  validate={testNumber()}
                                  value={values.contests[i].candidates[j].numVotes}
                                  // disabled={locked}
                                  component={WideField}
                                />
                                <ErrorMessage name={`contests[${i}].candidates[${j}].numVotes`} component={ErrorLabel} />
                              </label>
                            </FormSection>
                          )
                        })}
                      </FormSection>
                    </div>
                  )
                })}
                <AddButton onClick={ () => contestsArrayHelpers.push({ ...dummyContests[0] }) }>+</AddButton>&emsp;Add another contest
              </SpacedDiv>
            )}
          />
          <FormButton
            type="button"
            intent="primary"
            large
            onClick={handleSubmit}
            loading={submitting}
          >
            Submit
          </FormButton>
        </ResultsDataFormWrapper>
      )}
    </Formik>
  )
}

const ResponsiveInner = styled(Inner)`
  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`

const ElectionResults: React.FC = () => {
  const auth = useAuthDataContext()
  if (auth && (!auth.user || auth.user.type !== 'jurisdiction_admin')) {
    return (
    <Redirect to="/admin" />
    )
  }
  
  return (
  <Wrapper>
    <ResponsiveInner>
      <ResultsDataForm />
      <ResultsDataUpload />
    </ResponsiveInner>
  </Wrapper>
  )
}

export default ElectionResults