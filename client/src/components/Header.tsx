import React from 'react'
import styled from 'styled-components'
import {
  Navbar,
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
import { Link } from 'react-router-dom'
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

const Header: React.FC<{}> = () => {
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
                alt="Arlo, by VotingWorks"
                className="logo-desktop"
              />
              <img
                src="/arlo-mobile.png"
                alt="Arlo, by VotingWorks"
                className="logo-mobile"
              />
            </Link>
          </NavbarHeading>
        </NavbarGroup>
        {auth && auth.user && auth.user.type !== 'audit_board' && (
          <>
            <NavbarGroup align={Alignment.RIGHT}>
              <UserMenu>
                <Popover
                  content={
                    <Menu>
                      <MenuItem text="Log out" href="/auth/logout" />
                    </Menu>
                  }
                  usePortal={false}
                  position={Position.BOTTOM}
                  minimal
                  fill
                >
                  <Button icon="user" minimal>
                    {auth.user.email}
                  </Button>
                </Popover>
              </UserMenu>
            </NavbarGroup>
          </>
        )}
      </InnerBar>
    </Nav>
  )
}

export default Header