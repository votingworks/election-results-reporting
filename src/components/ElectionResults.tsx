import React from 'react'
import { HTMLSelect } from '@blueprintjs/core'
import styled from 'styled-components'
import { Formik, FormikProps, Field, FieldArray } from 'formik'
import FormSection from './Atoms/Form/FormSection'
import FormButton from './Atoms/Form/FormButton'
import { Wrapper, Inner } from './Atoms/Wrapper'
import Card from './Atoms/SpacedCard'
import FormField from './Atoms/Form/FormField'
import CSVFile, { IFileInfo } from './CSVForm/index'

const ResultsDataWrapper = styled.div`
  padding: 30px;
`

const UploadResultsDataWrapper = styled.div`
  padding: 30px;
`

interface ICandidate {
  id: string
  name: string
  numVotes: string
}

interface IContest {
  id: string
  contestName: string
  choices: ICandidate[]
}

interface IValues {
  precintName: string
  ballotType: string
  totalBallotsCast: number
  contest: string
  contestTotal1: number
  contests: IContest[]
}

const ResultsData = () => {
  const contestValues: IContest[] = [
    {
      id: '',
      contestName: '',
      choices: [
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
      choices: [
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

  return (
    <Formik
      onSubmit={() => console.log('submitted')}
      initialValues={{
        precintName: '',
        ballotType: '',
        totalBallotsCast: 0,
        contest: '',
        contestTotal1: 0,
        contests: dummyArr,
      }}
    >
      {({ setFieldValue, setValues, values }: FormikProps<IValues>) => (
        <ResultsDataWrapper>
          <h2>Election Results Data</h2>
          <Card>
            <FormSection>
              {/* eslint-disable jsx-a11y/label-has-associated-control */}
              <label htmlFor="precintName">
                <p>Precint Name</p>
                <HTMLSelect
                  id="precintName"
                  name="precintName"
                  onChange={(e) =>
                    setFieldValue('precintName', e.currentTarget.value)
                  }
                  value={values.precintName}
                >
                  <option value="1">Option One</option>
                  <option value="2">Option Two</option>
                  <option value="3">Option Three</option>
                </HTMLSelect>
              </label>
            </FormSection>
            <FormSection>
              {/* eslint-disable jsx-a11y/label-has-associated-control */}
              <label htmlFor="ballotType">
                <p>Ballot Type</p>
                <HTMLSelect
                  id="ballotType"
                  name="ballotType"
                  onChange={(e) =>
                    setFieldValue('ballotType', e.currentTarget.value)
                  }
                  value={values.ballotType}
                >
                  <option value="1">Option One</option>
                  <option value="2">Option Two</option>
                  <option value="3">Option Three</option>
                </HTMLSelect>
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
                  component={FormField}
                />
              </label>
            </FormSection>
          </Card>

          <h3>Vote Totals</h3>
          <FieldArray
            name="contests"
            render={(contestsArrayHelpers) => (
              <Card style={{ marginBottom: '30px' }}>
                {values.contests.map((contest: IContest, i: number) => {
                  return (
                    <div key={contest.id}>
                      <FormSection>
                        {/* eslint-disable jsx-a11y/label-has-associated-control */}
                        <label htmlFor="contest">
                          <p>Contest</p>
                          <HTMLSelect
                            id={`contests[${i}].name`}
                            name={`contests[${i}].name`}
                            onChange={(e) =>
                              setFieldValue(
                                `contests[${i}].name`,
                                e.currentTarget.value
                              )
                            }
                            value={`contests[${i}].id`}
                          >
                            {/* <option selected>Choose Contest</option> */}
                            <option value="1">Contest 1</option>
                            <option value="2">Contest 2</option>
                            <option value="3">Option Three</option>
                          </HTMLSelect>
                        </label>
                      </FormSection>
                      {contest.choices.map((choice: ICandidate, j: number) => {
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
                                value={values.contests[i].choices[j].numVotes}
                                component={FormField}
                              />
                            </label>
                          </FormSection>
                        )
                      })}
                    </div>
                  )
                })}

                <FormButton
                  onClick={() =>
                    contestsArrayHelpers.push({ ...contestValues[0] })
                  }
                >
                  Add another contest
                </FormButton>
              </Card>
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
        </ResultsDataWrapper>
      )}
    </Formik>
  )
}

const ElectionResults: React.FC = () => {
  const resultsDataFile: IFileInfo = {
    file: null,
    processing: null,
  }

  return (
    <Wrapper>
      <Inner>
        <div style={{ width: '50%' }}>
          <ResultsData />
        </div>
        <div style={{ width: '50%' }}>
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
        </div>
      </Inner>
    </Wrapper>
  )
}

export default ElectionResults