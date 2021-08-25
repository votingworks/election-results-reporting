import React from 'react'
import {
  Route,
  RouteProps,
  Switch,
  useLocation
} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { AnchorButton, Card, Callout } from '@blueprintjs/core'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import { Wrapper } from './components/Atoms/Wrapper'

import AuthDataProvider, {
  useAuthDataContext,
} from './components/UserContext'

import HomeScreen from './components/HomeScreen'
import ElectionScreen from './components/ElectionScreen'
import ElectionResults from './components/ElectionResults'
import ElectionData from './components/ElectionData'

const LoginWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (min-width: 500px) {
    width: 400px;
  }
  text-align: center;
`

interface ILoginScreenProps {
  successRedirect: string | undefined
}

const LoginScreen: React.FC<ILoginScreenProps> = ({ successRedirect }: ILoginScreenProps) => {
  // Support two query parameters: 'error' and 'message'
  // We use these to communicate authentication errors to the user.
  const query = new URLSearchParams(useLocation().search)

  return (
    <LoginWrapper>
      <img height="50px" src="/elrep.png" alt="Election Results Reporting, by VotingWorks" />
      {query.get('error') && (
        <Callout intent="danger" style={{ margin: '20px 0 20px 0' }}>
          {query.get('message')}
        </Callout>
      )}
      <Card style={{ margin: '25px 0 15px 0' }}>
        <p>Log in to Election Results Reporting:</p>
        <AnchorButton
          href={'/auth/admin/start'+(successRedirect ? `?redirectOnSucess=${successRedirect}` : '')}
          intent="primary"
          large
        >
          Log in as Admin
        </AnchorButton>
      </Card>
    </LoginWrapper>
  )
}


const PrivateRoute: React.FC<RouteProps> = ({
  ...props
}: RouteProps) => {
  const auth = useAuthDataContext()
  if (auth && auth.user) console.log(auth.user)
  if (auth === null) {
    // Still loading /api/me, don't show anything
    return null
  }
  if (auth.user) {
    return <Route {...props} />
  }
  return (
    <LoginScreen successRedirect={ props.location ? props.location.pathname : '/' } />
  )
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <AuthDataProvider>
        <Main>
          <Route path="/" component={Header} />
          <Switch>
            <Route exact path="/" component={HomeScreen} />
            <PrivateRoute
              exact path="/election/home"
              component={ElectionScreen}
            />
            <PrivateRoute
              exact path="/election/results"
              component={ElectionResults}
            />
            <PrivateRoute
              exact path="/election/data"
              component={ElectionData}
            />
            <Route>
              <Wrapper>404 Not Found</Wrapper>
            </Route>
          </Switch>
        </Main>
      </AuthDataProvider>
    </>
  )
}

export default App 