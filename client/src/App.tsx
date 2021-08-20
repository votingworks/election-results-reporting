import React from 'react'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import { Wrapper } from './components/Atoms/Wrapper'
import {
  Route,
  RouteProps,
  Switch,
  Redirect
} from 'react-router-dom'

import AuthDataProvider, {
  useAuthDataContext,
} from './components/UserContext'

import HomeScreen from './components/HomeScreen'
import ElectionScreen from './components/ElectionScreen'
import ElectionResults from './components/ElectionResults'
import ElectionData from './components/ElectionData'

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const PrivateRoute: React.FC<RouteProps> = ({
  ...props
}: RouteProps) => {
  const auth = useAuthDataContext()
  if (auth === null) {
    // Still loading /api/me, don't show anything
    return <></>
  }
  if (auth.user) {
    return <Route {...props} />
  }
  return (
    <Route
      render={() => (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      )}
    />
  )
}

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