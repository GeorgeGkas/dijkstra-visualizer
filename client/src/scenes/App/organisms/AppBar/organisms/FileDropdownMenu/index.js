/**
 * Import globals.
 */
import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

/**
 * Import UI framework modules.
 */
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Fade from '@material-ui/core/Fade'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'

/**
 * Import ducks.
 */
import { operations as algorithmOperations } from '../../../EditorBar/duck'
import { operations as editorOperations } from '../../../Editor/ducks/editor'
import { operations as graphOperations } from '../../../Editor/ducks/graph'
import { operations as userOperations } from '../../../../../../ducks/user'

/**
 * Import components.
 */
import ConfirmDialog from '../../../../../../organisms/ConfirmDialog'
import Notification from '../../../../../../organisms/Notification'
import PromptSaveDialog from './organisms/PromptSaveDialog'

/**
 * Import services
 */
import cloudSave from './services/cloudSave'
import cloudUpdate from './services/cloudUpdate'
import localDownload from './services/localDownload'

/**
 * Connect component to Redux.
 */
const mapStateToProps = state => ({
  currentEditorAction: state.editor.currentEditorAction,
  futureExist: state.graph.future.length,
  graph: state.graph.present,
  isSignIn: state.user.isSignIn,
  pastExist: state.graph.past.length,
  profile: state.user.profile,
  selectedProjectId: state.user.selectedProjectId,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...editorOperations,
      ...algorithmOperations,
      ...graphOperations,
      ...userOperations,
    },
    dispatch,
  )

/**
 * Component
 */
const FileDropdownMenu = ({
  TransitionProps,
  currentEditorAction,
  fileDropdownMenu,
  futureExist,
  graph,
  initGraphHistory,
  isSignIn,
  pastExist,
  profile,
  selectProject,
  selectedProjectId,
}) => {
  const [overwriteDialogVisible, makeOverwriteDialogVisible] = useState(false)
  const toggleOverwriteDialog = () =>
    makeOverwriteDialogVisible(!overwriteDialogVisible)

  const [promptSaveDialogVisible, makePromptSaveDialogVisible] = useState(false)
  const togglePromptSaveDialog = () =>
    makePromptSaveDialogVisible(!promptSaveDialogVisible)

  return (
    <React.Fragment>
      <Fade {...TransitionProps} timeout={360}>
        <Paper square id="menu-list-grow">
          <ClickAwayListener onClickAway={fileDropdownMenu.close}>
            <MenuList>
              <MenuItem
                button
                disabled={currentEditorAction === 'isPlaying'}
                onClick={() => {
                  if (futureExist || pastExist) {
                    toggleOverwriteDialog()
                  } else {
                    initGraphHistory()
                    selectProject('')
                    fileDropdownMenu.close()
                  }
                }}
              >
                <ListItem component="div">
                  <ListItemText primary="New" />
                </ListItem>
              </MenuItem>

              <MenuItem
                button
                disabled={currentEditorAction === 'isPlaying'}
                onClick={() => document.getElementById('load_state').click()}
              >
                <ListItem component="div">
                  <ListItemText primary="Open" />
                </ListItem>
              </MenuItem>

              {isSignIn ? (
                <MenuItem
                  button
                  disabled={currentEditorAction === 'isPlaying'}
                  onClick={async () => {
                    if (selectedProjectId) {
                      const data = {
                        graph: JSON.stringify(graph),
                      }

                      fileDropdownMenu.close()
                      toast(<Notification message="Updating project..." />)
                      const res = await cloudUpdate(
                        selectedProjectId,
                        data,
                        profile.token,
                      )

                      if (res.status === 204) {
                        toast(
                          <Notification message="Project updated successfully" />,
                        )
                      } else {
                        toast(
                          <Notification message="Could not update project" />,
                        )
                      }
                    } else {
                      togglePromptSaveDialog()
                    }
                  }}
                >
                  <ListItem component="div">
                    <ListItemText primary="Save" />
                  </ListItem>
                </MenuItem>
              ) : null}

              <MenuItem
                button
                disabled={currentEditorAction === 'isPlaying'}
                onClick={() => localDownload(graph)}
              >
                <ListItem component="div">
                  <ListItemText primary="Download" />
                </ListItem>
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Fade>

      <ConfirmDialog
        confirmAction={() => {
          initGraphHistory()
          selectProject('')
          toggleOverwriteDialog()
          fileDropdownMenu.close()
        }}
        confirmDialogVisible={overwriteDialogVisible}
        confirmMessage={
          'All unsaved changes will be deleted if you confirm this action.'
        }
        confirmTitle="Create new project?"
        handleClose={toggleOverwriteDialog}
      />

      <PromptSaveDialog
        handleClose={togglePromptSaveDialog}
        promptSaveDialogAction={async projectName => {
          const data = {
            algorithm: 'Dijkstra',
            author: profile.id,
            createdAt: new Date().toISOString(),
            graph: JSON.stringify(graph),
            name: projectName,
          }

          toast(<Notification message="Saving project..." />)
          const res = await cloudSave(data, profile.token)

          if (res.status === 201) {
            toast(<Notification message="Project saved successfully" />)
            selectProject(res.data.data)
          } else {
            toast(<Notification message="Could not save project" />)
          }
        }}
        promptSaveDialogVisible={promptSaveDialogVisible}
      />
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileDropdownMenu)
