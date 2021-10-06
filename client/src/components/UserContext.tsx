import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react'
import { api } from './utilities'

export interface IElection {
  id: string,
  organizationId: string,
  electionName: string,
  electionDate: Date | string,
  pollsOpen: TimeRanges | string,
  pollsClose: TimeRanges | string,
  pollsTimezone: string,
  certificationDate: Date | string,
  jurisdictions: File | null,
  definition: File | null
}

export interface IOrganization {
  id: string
  name: string
  elections: IElection[]
}

export interface IJurisdiction {
  id: string
  name: string
  election: IElection
}

export interface IElectionAdmin {
  type: 'election_admin'
  name: string
  email: string
  organizations: IOrganization[]
  jurisdictions: []
}

export interface IJurisdictionAdmin {
  type: 'jurisdiction_admin'
  name: string
  email: string
  organizations: []
  jurisdictions: IJurisdiction[]
}

export type IUser = IElectionAdmin | IJurisdictionAdmin

export interface ISupportUser {
  email: string
}

export interface IAuthData {
  user: IUser | null
  supportUser: ISupportUser | null
}

const AuthDataContext = createContext<IAuthData | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthDataProvider = (props: any) => {
  const [authData, setAuthData] = useState<IAuthData | null>(null)

  useEffect(() => {
    ;(async () => {
      const response = await api<IAuthData>('/me')
      setAuthData(response)
    })()
  }, [])

  const authDataValue = useMemo(() => authData && { ...authData }, [authData])

  return <AuthDataContext.Provider value={authDataValue} {...props} />
}

export const useAuthDataContext = () => useContext(AuthDataContext)

export default AuthDataProvider