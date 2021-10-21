import { readFileSync } from 'fs'
import { join } from 'path'

export const jurisdictionFile = new File(
  [
    readFileSync(
      join(
        __dirname,
        '../../public/sample_jurisdiction_filesheet.csv'
      ),
      'utf8'
    ),
  ],
  'jurisdictions.csv',
  { type: 'text/csv' }
)
export const definitionFile = new File(
  [
    readFileSync(
      join(
        __dirname,
        '../../public/sample_definition_file.json'
      ),
      'utf8'
    ),
  ],
  'definition.json',
  { type: 'application/json' }
)

const jurisdictionFormData: FormData = new FormData()
jurisdictionFormData.append(
  'jurisdictions',
  jurisdictionFile,
  jurisdictionFile.name
)
const definitionFormData: FormData = new FormData()
definitionFormData.append(
  'definition',
  definitionFile,
  definitionFile.name
)

const definitionFileMockData = {
  contests: [
    {
      allowWriteIns: true, 
      candidates: [
        {
          id: "candidate-id-1", 
          name: "Candidate 1"
        }
      ], 
      id: "contest-id-1", 
      name: "Contest 1"
    },
    {
      allowWriteIns: true, 
      candidates: [
        {
          id: "candidate-id-1", 
          name: "Candidate 1"
        }, 
        {
          id: "candidate-id-2", 
          name: "Candidate 2"
        }, 
        {
          id: "candidate-id-3", 
          name: "Candidate 3"
        }, 
        {
          id: "candidate-id-4", 
          name: "Candidate 4"
        }
      ], 
      id: "contest-id-2", 
      name: "Contest 2"
    }, 
    {
      allowWriteIns: true, 
      candidates: [
        {
          id: "candidate-id-1", 
          name: "Candidate 1"
        }, 
        {
          id: "candidate-id-2", 
          name: "Candidate 2"
        }
      ], 
      id: "contest-id-3", 
      name: "Contest 3"
    },
  ], 
  precincts: [
    {
      id: "precinct-id-1", 
      name: "Precinct 1"
    }, 
    {
      id: "precinct-id-2", 
      name: "Precinct 2"
    }, 
    {
      id: "precinct-id-3", 
      name: "Precinct 3"
    }
  ]
}

export const apiCalls = {
  serverError: (
    url: string,
    error = { status: 500, statusText: 'Server Error' }
  ) => ({
    url,
    response: {
      errors: [{ errorType: 'Server Error', message: error.statusText }],
    },
    error,
  }),
  unauthenticatedUser: {
    url: '/api/me',
    response: { user: null, supportUser: null },
  },
}

export const jaApiCalls = {
  getUser: {
    url: '/api/me',
    response: {
      user: {
        type: 'jurisdiction_admin',
        email: 'jurisdictionadmin@email.org',
        jurisdictions: [
          {
            id: 'jurisdiction-id-1',
            name: 'Jurisdiction 1',
            election: {
              id: "election-id-1", 
              electionName: "Election 1", 
              certificationDate: "2021-10-20", 
              pollsClose: "Tue, 12 Oct 2021 18:30:00 GMT", 
              pollsOpen: "Tue, 12 Oct 2021 08:30:00 GMT", 
              pollsTimezone: "IST",
              organizationId: "org-id-1"
            },
          },
          {
            id: 'jurisdiction-id-2',
            name: 'Jurisdiction 2',
            election: {
              id: "election-id-2", 
              electionName: "Election 2",
              certificationDate: "2021-10-22", 
              pollsClose: "Tue, 12 Oct 2021 14:30:00 GMT", 
              pollsOpen: "Tue, 12 Oct 2021 06:30:00 GMT", 
              pollsTimezone: "IST",
              organizationId: "org-id-1"
            },
          },
          {
            id: 'jurisdiction-id-3',
            name: 'Jurisdiction 3',
            election: {
              id: "election-id-3", 
              electionName: "Election 3", 
              certificationDate: "2021-10-21", 
              pollsClose: "Tue, 12 Oct 2021 12:30:00 GMT", 
              pollsOpen: "Tue, 12 Oct 2021 04:30:00 GMT", 
              pollsTimezone: "IST",
              organizationId: "org-id-1"
            },
          },
        ],
        organizations: [],
      },
      supportUser: null,
    },
  },
  getUserWithOneElection: {
    url: '/api/me',
    response: {
      user: {
        type: 'jurisdiction_admin',
        email: 'jurisdictionadmin@email.org',
        jurisdictions: [
          {
            id: 'jurisdiction-id-1',
            name: 'Jurisdiction 1',
            election: {
              id: "election-id-1", 
              electionName: "Election 1", 
              certificationDate: "2021-10-21", 
              pollsClose: "Tue, 12 Oct 2021 12:30:00 GMT", 
              pollsOpen: "Tue, 12 Oct 2021 04:30:00 GMT", 
              pollsTimezone: "IST",
              organizationId: "org-id-1"
            },
          },
        ],
        organizations: [],
      },
      supportUser: null,
    },
  },
  getUserWithoutElections: {
    url: '/api/me',
    response: {
      user: {
        type: 'jurisdiction_admin',
        email: 'jurisdictionadmin@email.org',
        jurisdictions: [],
        organizations: [],
      },
      supportUser: null,
    },
  },
  fetchWhenResultsNotUploaded: (electionId: string, jurisdictionId: string) => ({
    url: `/api/election/${electionId}/jurisdiction/${jurisdictionId}/results`,
    response: {
      status: 'not-uploaded'
    },
  }),
  fetchWhenResultsUploaded: (electionId: string, jurisdictionId: string) => ({
    url: `/api/election/${electionId}/jurisdiction/${jurisdictionId}/results`,
    response: {
      status: 'uploaded'
    },
  }),
  getDefinitionFile: (electionId: string) => ({
    url: `/api/election/${electionId}/definition/file`,
    response: definitionFileMockData,
  }),
  postElectionResultsData: (electionId: string, jurisdictionId: string, body: {}) => ({
    url: `/api/election/${electionId}/jurisdiction/${jurisdictionId}/results`,
    options: {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    response: { status: 'ok' },
  }),
}

const eaUser = {
  type: 'election_admin',
  email: 'electionadmin@email.org',
  jurisdictions: [],
  organizations: [
    {
      id: 'org-id-1',
      name: 'Organization 1',
      elections: [],
    },
  ],
}

export const eaApiCalls = {
  getUser: {
    url: '/api/me',
    response: {
      user: eaUser,
      supportUser: null,
    },
  },
  getUserWithElection: {
    url: '/api/me',
    response: {
      user: {
        ...eaUser,
        organizations: [
          {
            id: 'org-id-1',
            name: 'Organization 1',
            elections: [
              {
                id: "election-id-1", 
                electionName: "Election 1", 
                certificationDate: "2021-10-21", 
                organizationId: "org-id-1", 
                pollsClose: "Tue, 12 Oct 2021 12:30:00 GMT", 
                pollsOpen: "Tue, 12 Oct 2021 04:30:00 GMT", 
                pollsTimezone: "IST"
              },
            ],
          },
        ],
      },
      supportUser: null,
    },
  },
  getUserWithMultipleOrgs: {
    url: '/api/me',
    response: {
      user: {
        ...eaUser,
        organizations: [
          {
            id: 'org-id-1',
            name: 'Organization 1',
            elections: [
              {
                id: "election-id-1", 
                electionName: "Election 1",
                certificationDate: "2021-10-21",
                pollsClose: "Tue, 12 Oct 2021 12:30:00 GMT",
                pollsOpen: "Tue, 12 Oct 2021 04:30:00 GMT",
                pollsTimezone: "IST",
                organizationId: "org-id-1"
              },
            ],
          },
          {
            id: 'org-id-2',
            name: 'Organization 2',
            elections: [],
          },
        ],
      },
      supportUser: null,
    },
  },
  postNewElection: (formData: FormData) => {
    return {
      url: '/api/election',
      options: {
        method: 'POST',
        body: formData,
      },
      response: { status: 'ok' },
    }
  },
  getElectionResultsWith1Row: {
    url: '/api/election/election-id-1/data',
    response: {
      data: [
        {
          contests: [
            {
              allowWriteIns: true, 
              candidates: [
                {
                  id: "candidate-id-1", 
                  name: "Candidate 1", 
                  numVotes: 8
                }, 
                {
                  id: 1, 
                  name: "Write-in", 
                  numVotes: 4
                }
              ], 
              id: "contest-id-1", 
              name: "Contest 1"
            }
          ], 
          createdAt: "Tue, 19 Oct 2021 16:55:49 GMT", 
          fileName: "File 1", 
          id: "election-result-id-1", 
          jurisdictionName: "Jurisdiction 1", 
          source: "Data Entry", 
          totalBallotsCast: "12"
        },
      ], 
      message: "Entries Found"
    }
  },
  getElectionResultsWithMultipleRows: {
    url: '/api/election/election-id-1/data',
    response: {
      data: [
        {
          contests: [
            {
              allowWriteIns: true, 
              candidates: [
                {
                  id: "candidate-id-1", 
                  name: "Candidate 1", 
                  numVotes: 4
                }, 
                {
                  id: "candidate-id-2", 
                  name: "Candidate 2", 
                  numVotes: 3
                }, 
                {
                  id: 2, 
                  name: "Write-in", 
                  numVotes: 1
                }
              ], 
              id: "contest-id-1", 
              name: "Contest 1"
            }, 
            {
              allowWriteIns: true, 
              candidates: [
                {
                  id: "candidate-id-1", 
                  name: "Candidate 1", 
                  numVotes: 4
                }, 
                {
                  id: 1, 
                  name: "Write-in", 
                  numVotes: 2
                }
              ], 
              id: "contest-id-2", 
              name: "Contest 2"
            }
          ], 
          createdAt: "Tue, 19 Oct 2021 16:55:49 GMT", 
          fileName: "File 1", 
          id: "election-result-id-1", 
          jurisdictionName: "Jurisdiction 1", 
          source: "Data Entry", 
          totalBallotsCast: "14"
        },
        {
          contests: [
            {
              allowWriteIns: true, 
              candidates: [
                {
                  id: "candidate-id-1", 
                  name: "Candidate 1", 
                  numVotes: 8
                }, 
                {
                  id: 1, 
                  name: "Write-in", 
                  numVotes: 4
                }
              ], 
              id: "contest-id-1", 
              name: "Contest 1"
            }
          ], 
          createdAt: "Wed, 20 Oct 2021 15:41:24 GMT", 
          fileName: "File 2", 
          id: "election-result-id-1", 
          jurisdictionName: "Jurisdiction 2", 
          source: "Data Entry", 
          totalBallotsCast: "12"
        }
      ], 
      message: "Entries Found"
    }
  },
  getElectionResultsWithNoRows: {
    url: '/api/election/election-id-1/data',
    response: {
      message: "No entry found!"
    }
  },
}

export const supportApiCalls = {
  getUser: {
    url: '/api/me',
    response: {
      user: null,
      supportUser: { email: 'support@example.com' },
    },
  },
  getUserImpersonatingEA: {
    url: '/api/me',
    response: {
      user: eaUser,
      supportUser: { email: 'support@example.com' },
    },
  },
  getUserImpersonatingJA: {
    url: '/api/me',
    response: {
      user: jaApiCalls.getUser.response.user,
      supportUser: { email: 'support@example.com' },
    },
  },
}