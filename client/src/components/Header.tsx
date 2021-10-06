import React from 'react'
import { Link, useLocation, useRouteMatch, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import {
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  Button,
  Menu,
  MenuItem,
  Popover,
  Position,
  Colors,
  Icon
} from '@blueprintjs/core'
import { useAuthDataContext } from './UserContext'
import LinkButton from './Atoms/LinkButton'
import { Inner } from './Atoms/Wrapper'

const Nav = styled(Navbar)`
  width: 100%;
  height: auto;
  padding: 0;
  .bp3-navbar-heading img {
    height: 35px;
    padding-top: 5px;
  }
`

const UserMenu = styled.div`
  .bp3-button {
    border: 1px solid ${Colors.GRAY4};
    width: 200px;
  }
  .bp3-button-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bp3-menu {
    width: 200px;
  }
`

const SupportBar = styled(Navbar)`
  background-color: ${Colors.ROSE3};
  height: 35px;
  padding: 0;
  color: ${Colors.WHITE};
  font-weight: 500;
  .bp3-navbar-group {
    height: 35px;
  }
  a {
    text-decoration: none;
    color: ${Colors.WHITE};
    .bp3-icon {
      margin-right: 8px;
    }
  }
  .bp3-navbar-divider {
    border-color: rgba(255, 255, 255, 0.7);
  }
`

const InnerBar = styled(Inner)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .logo-mobile {
    display: none;
  }
  @media only screen and (max-width: 767px) {
    justify-content: center;
    .logo-desktop {
      display: none;
    }
    .logo-mobile {
      display: block;
    }
  }
`

const CustomMenuItem = styled(MenuItem)`
  text-decoration: none;
  color: inherit;
  :hover {
    text-decoration: none;
    color: inherit;
  }
`

interface TParams {
  electionId: string
  jurisdictionId?: string
}

const Header: React.FC<{}> = () => {
  const location = useLocation()
  const jurisdictionMatch:
    | RouteComponentProps<TParams>['match']
    | null = useRouteMatch(
    '/election/:electionId/jurisdiction/:jurisdictionId?'
  )
  const supportMatch = useRouteMatch('/support')
  const auth = useAuthDataContext()
  const jurisdiction =
    jurisdictionMatch &&
    auth &&
    auth.user &&
    auth.user.type === 'jurisdiction_admin' &&
    auth.user.jurisdictions.find(
      j => j.id === jurisdictionMatch.params.jurisdictionId
    )

  return (
    <>
      {auth && auth.supportUser && (
        <SupportBar>
          <InnerBar>
            <NavbarGroup align={Alignment.LEFT}>
              <a href="/support">
                <Icon icon="eye-open" />
                <span>Elrep Support Tools</span>
              </a>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              <span>{auth.supportUser.email}</span>
              <NavbarDivider />
              <a href="/auth/support/logout">Log out</a>
            </NavbarGroup>
          </InnerBar>
        </SupportBar>
      )}
      {!supportMatch && (
        <Nav>
          <InnerBar>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>
                <Link to={location.pathname === "/" || location.pathname === "/admin" ? "/" : "/admin"}>
                  <img
                    src="/elrep.png"
                    alt="Election Results Reporting, by VotingWorks"
                    className="logo-desktop"
                  />
                  <img
                    src="/elrep-mobile.png"
                    alt="Election Results Reporting, by VotingWorks"
                    className="logo-mobile"
                  />
                </Link>
              </NavbarHeading>
              <NavbarDivider />
              {jurisdiction && (
                <NavbarHeading>Jurisdiction: {jurisdiction.name}</NavbarHeading>
              )}
            </NavbarGroup>&nbsp;
            <NavbarGroup align={Alignment.RIGHT}>
              { auth && !auth.user && location.pathname === '/' && (
                <LinkButton
                  icon="user"
                  to={`/admin`}
                  outlined
                >
                  Admin Login
                </LinkButton>
              )}
              { auth && auth.user && (
              <>
                <UserMenu>
                  <Popover
                    content={
                      <Menu>
                        <CustomMenuItem text="Log out" href="/auth/logout" icon="log-out" />
                      </Menu>
                    }
                    usePortal={false}
                    position={ Position.BOTTOM }
                    minimal
                    fill
                  >
                    <Button icon="user" minimal>
                      {auth.user.email}
                    </Button>
                  </Popover>
                </UserMenu>
              </>
              )}
            </NavbarGroup>
          </InnerBar>
        </Nav>
      )}
      </>
  )
}

export default Header