import React from 'react'
import { HTMLSelect } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, FormikProps, Field, FieldArray, ErrorMessage } from 'formik'
import FormSection from './Atoms/Form/FormSection'
import FormButton from './Atoms/Form/FormButton'
import { ErrorLabel } from './Atoms/Form/_helpers'
import { Wrapper, Inner } from './Atoms/Wrapper'
import FormField from './Atoms/Form/FormField'
import CSVFile, { IFileInfo } from './CSVForm/index'

interface ICandidate {
  id: string
  name: string
  numVotes: string
}

interface IContest {
  id: string
  contestName: string
  candidates: ICandidate[]
}

interface IValues {
  precinctName: string
  ballotType: string
  totalBallotsCast: number
  contest: string
  contestTotal1: number
  contests: IContest[]
}

const ResultsDataUpload = () => {
  const UploadResultsDataWrapper = styled.div`
    width: 100%;
    padding: 30px;
  `

  const resultsDataFile: IFileInfo = {
    file: null,
    processing: null,
  }

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

const ResultsDataForm = () => {
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

  const contestValues: IContest[] = [
    {
      id: '',
      contestName: '',
      candidates: [
        {
          id: '1',
          name: 'Troy R. Kimble',
          numVotes: '',
        },
        {
          id: '2',
          name: 'George Flaggs Jr.',
          numVotes: '',
        },
        {
          id: '3',
          name: 'Daryl Hollingsworth',
          numVotes: '',
        },
        {
          id: '4',
          name: 'Write-in',
          numVotes: '',
        },
      ],
    },
  ]
  const dummyArr: IContest[] = [
    {
      id: '1',
      contestName: 'Contest 1',
      candidates: [
        {
          id: '1',
          name: 'Troy R. Kimble',
          numVotes: '',
        },
        {
          id: '2',
          name: 'George Flaggs Jr.',
          numVotes: '',
        },
        {
          id: '3',
          name: 'Daryl Hollingsworth',
          numVotes: '',
        },
        {
          id: '4',
          name: 'Write-in',
          numVotes: '',
        },
      ],
    },
  ]

  const labelValuePrecincts = [
    { value: 'P1', label: 'Precinct 1' },
    { value: 'P2', label: 'Sample Precinct 2' },
    { value: 'P3', label: 'Sample 3' }
  ]

  const labelValueBallotTypes = [
    { value: 'B1', label: 'Ballot 1' },
    { value: 'B2', label: 'Sample Ballot 2' },
    { value: 'B3', label: 'Type 3' }
  ]

  const labelValueContests = [
    { value: 'C1', label: 'Contest 1' },
    { value: 'C2', label: 'Sample Contest 2' },
    { value: 'C3', label: 'Sample 3' }
  ]

  return (
    <Formik
      onSubmit={() => console.log('submitted')}
      initialValues={{
        precinctName: '',
        ballotType: '',
        totalBallotsCast: 0,
        contest: '',
        contestTotal1: 0,
        contests: dummyArr,
      }}
    >
      {({ setFieldValue, setValues, values }: FormikProps<IValues>) => (
        <ResultsDataFormWrapper>
          <h2>Election Results Data</h2>
          <FormSection>
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <label htmlFor="precinctName">
              <p>Precinct Name</p>
              <div>
                <Field
                  component={Select}
                  id="precinctName"
                  name="precinctName"
                  onChange={(e: React.FormEvent<HTMLSelectElement>) =>
                    setFieldValue('precinctName', e.currentTarget.value)
                  }
                  value={values.precinctName}
                  options={[{ value: '', label: 'Choose' }, ...labelValuePrecincts]}
                  />
                  <ErrorMessage name="precinctName" component={ErrorLabel} />
                </div>
              </label>
            </FormSection>
            <FormSection>
              {/* eslint-disable jsx-a11y/label-has-associated-control */}
              <label htmlFor="ballotType">
                <p>Ballot Type</p>
                <div>
                  <Field
                    component={Select}
                  id="ballotType"
                  name="ballotType"
                  onChange={(e: React.FormEvent<HTMLSelectElement>) =>
                    setFieldValue('ballotType', e.currentTarget.value)
                  }
                  value={values.precinctName}
                  options={[{ value: '', label: 'Choose' }, ...labelValueBallotTypes]}
                />
              <ErrorMessage name="ballotType" component={ErrorLabel} />
              </div>
            </label>
          </FormSection>
          <FormSection>
            <label htmlFor="totalBallotsCast">
              Total Ballots for Contest
              {/* istanbul ignore next */}
              <Field
                id="totalBallotsCast"
                name="totalBallotsCast"
                // validate={testNumber()}
                value={values.totalBallotsCast}
                component={WideField}
              />
            </label>
          </FormSection>

          <FieldArray
            name="contests"
            render={(contestsArrayHelpers) => (
              <SpacedDiv>
                <h3>Vote Totals</h3>
                {values.contests.map((contest: IContest, i: number) => {
                  return (
                    <div key={contest.id}>
                      <FormSection>
                        {/* eslint-disable jsx-a11y/label-has-associated-control */}
                        <label htmlFor="contest">
                        <p>Contest [{i+1}]</p>
                          <div>
                            <Field
                              component={Select}
                              id={`contests[${i}].name`}
                              name={`contests[${i}].name`}
                              onChange={(e: React.FormEvent<HTMLSelectElement>) =>
                                setFieldValue(`contests[${i}].name`, e.currentTarget.value)
                              }
                              value={`contests[${i}].id`}
                              options={[{ value: '', label: 'Choose' }, ...labelValueContests]}
                            />
                            <ErrorMessage name={`contests[${i}].name`} component={ErrorLabel} />
                          </div>
                        </label>
                      </FormSection>
                      <section>
                        {contest.candidates.map((choice: ICandidate, j: number) => {
                          return (
                            <FormSection key={contest.id + choice.id}>
                              <label htmlFor="contestTotal1">
                                {choice.name}
                                {/* istanbul ignore next */}
                                <Field
                                  id={`contests[${i}].choice[${j}].name`}
                                  name={`contests[${i}].choice[${j}].name`}
                                  // validate={testNumber()}
                                  // disabled={locked}
                                  value={values.contests[i].candidates[j].numVotes}
                                  component={WideField}
                                />
                              </label>
                            </FormSection>
                          )
                        })}
                      </section>
                    </div>
                  )
                })}
                <AddButton onClick={ () => contestsArrayHelpers.push({ ...contestValues[0] }) }>+</AddButton>&emsp;Add another contest
              </SpacedDiv>
            )}
          />
          <FormButton
            type="button"
            intent="primary"
            large
            // onClick={handleSubmit}
            // loading={submitting}
          >
            Submit
          </FormButton>
        </ResultsDataFormWrapper>
      )}
    </Formik>
  )
}

const ElectionResults: React.FC = () => {
  const ResponsiveInner = styled(Inner)`
    @media only screen and (max-width: 768px) {
      flex-direction: column-reverse;
      align-items: center;
    }
  `

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