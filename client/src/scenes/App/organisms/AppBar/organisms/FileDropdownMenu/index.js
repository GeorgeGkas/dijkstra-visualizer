/**
 * Import globals.
 */
import React from 'react'
import { bindActionCreators, compose } from 'redux'
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
import { operations as algorithmOperations } from '../../../../ducks/algorithm'
import { operations as editorOperations } from '../../../../ducks/editor'
import { operations as graphOperations } from '../../../../ducks/graph'
import { operations as projectsOperations } from '../../../../../../ducks/projects'

/**
 * Import components.
 */
import ConfirmDialog from '../../../../../../organisms/ConfirmDialog'
import Notification from '../../../../../../organisms/Notification'

/**
 * Import services
 */
import localDownload from './services/localDownload'
import { withAuthentication } from '../../../../../../providers/Auth'

/**
 * Connect component to Redux.
 */
const mapStateToProps = state => ({
  currentEditorAction: state.editor.currentEditorAction,
  futureExist: state.graph.future.length,
  graph: state.graph.present,
  pastExist: state.graph.past.length,
  projects: state.projects,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...editorOperations,
      ...algorithmOperations,
      ...graphOperations,
      ...projectsOperations,
    },
    dispatch,
  )

/**
 * Component
 */
const FileDropdownMenu = ({
  TransitionProps,
  auth,
  createProject,
  currentEditorAction,
  fileDropdownMenu,
  futureExist,
  graph,
  handleCreateModalOpen,
  pastExist,
  updateProjectById,
}) => {
  const [overwriteDialogVisible, makeOverwriteDialogVisible] = React.useState(
    false,
  )
  const toggleOverwriteDialog = () =>
    makeOverwriteDialogVisible(!overwriteDialogVisible)

  return (
    <>
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
                    handleCreateModalOpen()
                    fileDropdownMenu.close()
                  }
                }}
              >
                <ListItem component="div">
                  <ListItemText primary="New" />
                </ListItem>
              </MenuItem>

              {auth.authUser ? (
                <MenuItem
                  button
                  disabled={currentEditorAction === 'isPlaying'}
                  onClick={async () => {
                    const data = {
                      author: auth.authUser.uid,
                      graph: JSON.stringify(graph),
                    }

                    fileDropdownMenu.close()
                    if (graph.metadata.id) {
                      await updateProjectById(graph.metadata.id, data)
                    } else {
                      toast.dismiss()
                      toast(<Notification message="Saving project..." />)

                      await createProject(data)

                      toast.dismiss()
                      toast(
                        <Notification message="Project saved successfully" />,
                      )
                    }
                  }}
                >
                  <ListItem component="div">
                    <ListItemText
                      primary={graph.metadata.id ? 'Update' : 'Save'}
                    />
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
          handleCreateModalOpen()
          fileDropdownMenu.close()
        }}
        confirmDialogVisible={overwriteDialogVisible}
        confirmMessage={
          'All unsaved changes will be deleted if you confirm this action.'
        }
        confirmTitle="Create new project?"
        handleClose={toggleOverwriteDialog}
      />
    </>
  )
}

export default compose(
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(FileDropdownMenu)
