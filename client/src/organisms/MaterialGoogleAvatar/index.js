import Avatar from '@material-ui/core/Avatar'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Fade from '@material-ui/core/Fade'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { makeStyles } from '@material-ui/core/styles'
import {
  bindPopover,
  bindToggle,
  usePopupState,
} from 'material-ui-popup-state/hooks'
import React from 'react'

import GoogleSignIn from './organisms/GoogleSignIn'
import SignOutComponent from './organisms/SignOut'

const useStyles = makeStyles(theme => ({
  avatar: {
    height: 30,
    margin: 10,
    width: 30,
  },
  avatarMenu: {
    borderRadius: 0,
    marginTop: '-30px',
  },
  avatarMenuButton: {
    padding: 0,
  },
}))

const MaterialGoogleAvatar = ({ auth }) => {
  const classes = useStyles()
  const profileDropdownMenu = usePopupState({
    popupId: 'profileDropdownMenu',
    variant: 'popover',
  })

  if (auth.authUser) {
    return (
      <div id="google_signin_button">
        <IconButton
          className={classes.avatarMenuButton}
          color="inherit"
          {...bindToggle(profileDropdownMenu)}
        >
          <Avatar
            alt=""
            className={classes.avatar}
            src={auth.authUser.imageUrl}
          />
        </IconButton>
        <Popper
          {...bindPopover(profileDropdownMenu)}
          transition
          style={{ zIndex: 9999 }}
        >
          {({ TransitionProps }) => (
            <Fade
              {...TransitionProps}
              className={classes.avatarMenu}
              timeout={360}
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={profileDropdownMenu.close}>
                  <MenuList>
                    <SignOutComponent
                      render={doSignOut => (
                        <MenuItem onClick={doSignOut}>Sign out</MenuItem>
                      )}
                      onFailure={console.error}
                      onSuccess={profileDropdownMenu.close}
                    />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    )
  } else {
    return (
      <div id="google_signin_button">
        <GoogleSignIn
          buttonText="Sign In"
          onFailure={console.error}
          onSuccess={_ => _}
        />
      </div>
    )
  }
}

export default MaterialGoogleAvatar
