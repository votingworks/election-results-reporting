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
// export const jurisdictionErrorFile = new File(
//   [
//     readFileSync(
//       join(
//         __dirname,
//         '../../public/test_error_jurisdiction_filesheet.csv'
//       ),
//       'utf8'
//     ),
//   ],
//   'jurisdictions.csv',
//   { type: 'text/csv' }
// )
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
// export const definitionErrorFile = new File(
//   [
//     readFileSync(
//       join(
//         __dirname,
//         '../../public/test_error_definition_file.json'
//       ),
//       'utf8'
//     ),
//   ],
//   'definition.json',
//   { type: 'application/json' }
// )

const jurisdictionFormData: FormData = new FormData()
jurisdictionFormData.append(
  'jurisdictions',
  jurisdictionFile,
  jurisdictionFile.name
)
// const jurisdictionErrorFormData: FormData = new FormData()
// jurisdictionErrorFormData.append(
//   'jurisdictions',
//   jurisdictionErrorFile,
//   jurisdictionErrorFile.name
// )
const definitionFormData: FormData = new FormData()
definitionFormData.append(
  'definition',
  definitionFile,
  definitionFile.name
)
// const definitionErrorFormData: FormData = new FormData()
// definitionErrorFormData.append(
//   'definition',
//   definitionErrorFile,
//   definitionErrorFile.name
// )

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
              id: "election-id-2", 
              electionName: "Election 2", 
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
  getUserMultipleOrgs: {
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
            name: 'Org 2',
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
  }},
  deleteElection: {
    url: '/api/election/1',
    options: { method: 'DELETE' },
    response: { status: 'ok' },
  },
  getJurisdictions: {
    url: '/api/election/1/jurisdiction',
    response: {
      jurisdictions: [
        {
          id: 'jurisdiction-id-1',
          name: 'Jurisdiction One',
        },
        {
          id: 'jurisdiction-id-2',
          name: 'Jurisdiction Two',
        },
      ],
    },
  },
  getBatchJurisdictions: {
    url: '/api/election/1/jurisdiction',
    response: {
      jurisdictions: [
        {
          id: 'jurisdiction-id-1',
          name: 'Jurisdiction One',
        },
        {
          id: 'jurisdiction-id-2',
          name: 'Jurisdiction Two',
        },
      ],
    },
  },
  getDefinitionFile: {
    url: '/api/election/1/jurisdiction/file',
    response: {
      file: {
        name: 'file name',
        uploadedAt: '2020-12-04T02:31:15.419+00:00',
      },
      processing: {
        // status: FileProcessingStatus.Processed,
        error: null,
        startedAt: '2020-12-04T02:32:15.419+00:00',
        completedAt: '2020-12-04T02:32:15.419+00:00',
      },
    },
  },
  // putJurisdictionFile: {
  //   url: '/api/election/1/jurisdiction/file',
  //   options: {
  //     method: 'PUT',
  //     body: jurisdictionFormData,
  //   },
  //   response: { status: 'ok' },
  // },
  // putJurisdictionErrorFile: {
  //   url: '/api/election/1/jurisdiction/file',
  //   options: {
  //     method: 'PUT',
  //     body: jurisdictionErrorFormData,
  //   },
  //   response: { status: 'ok' },
  // },
  // getJurisdictionFileWithResponse: (response: IFileInfo) => ({
  //   url: '/api/election/1/jurisdiction/file',
  //   response,
  // }),
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