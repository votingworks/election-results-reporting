import React from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  Colors
} from '@blueprintjs/core'
import LinkButton from './Atoms/LinkButton'
import { useAuthDataContext } from './UserContext'
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

const Header: React.FC<{}> = () => {
  const location = useLocation()
  const auth = useAuthDataContext()

  if (auth && auth.user && auth.user.type === 'audit_board') return null

  return (
    <Nav>
      <InnerBar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>
            <Link to="/">
              <img
                src="/arlo.png"
                alt="Election Results Reporting, by VotingWorks"
                className="logo-desktop"
              />
              <img
                src="/arlo-mobile.png"
                alt="Election Results Reporting, by VotingWorks"
                className="logo-mobile"
              />
            </Link>
          </NavbarHeading>
          <NavbarDivider />
          <LinkButton to="/" icon="home" className={ `bp3-minimal ${location.pathname === '/' ? 'bp3-active' : ''}` }> Home</LinkButton>&nbsp;
          <Popover content={
            <Menu>
              <CustomMenuItem icon="edit" href="/election/home" text="Create/View Election" active={ location.pathname === '/election/home' } />
              <CustomMenuItem icon="cloud-upload" href="/election/results" text="Load Results Data" active={ location.pathname === '/election/results' } />
              <CustomMenuItem icon="panel-table" href="/election/results" text="Election Data" active={ location.pathname === '/election/data' } />
            </Menu>
          } position={ Position.BOTTOM_LEFT } minimal>
            <Button className="bp3-minimal" icon="application" rightIcon="caret-down" text="Election" active={ location.pathname.indexOf('/election/') > -1 } />
          </Popover>
        </NavbarGroup>&nbsp;
        <NavbarGroup align={Alignment.RIGHT}>
          {auth && auth.user && auth.user.type !== 'audit_board' && (
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
  )
}

export default Header