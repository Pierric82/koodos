import * as React from "react"
import Masonry from "react-masonry-css"
import {AiFillEdit} from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'
import {GrChapterAdd} from 'react-icons/gr'

import { getFullBoardLive, createEntry, updateEntry, removeEntry} from "../services/backend"
import {IEntry,IBoard} from "../interfaces/interfaces"
import AddEntryDialog from "./addEntry"
import AlertDialog from "./alertDialog"
import { LoginContext } from "../services/loginContext"
import { updateNavigation } from "../services/navigation"
import Loading from "./loading"

export default function BoardComponent ({ boardId }:
{ boardId: string })  {
    const [loginState, setLoginState] = React.useContext(LoginContext)
    const emptyBoard: IBoard = { id:'',title: 'loading...', creator: {id:'',nickname: 'loading...'}, entries: [] }
    const [activeBoard, setActiveBoard] = React.useState<IBoard>(emptyBoard)

    // async board loading and setting
    function handleBoardLoaded(board: IBoard) {
        console.log(`handleBoardLoaded ongoing, board id is '${board.id}'`)
        setActiveBoard(board)
        updateNavigation(board.title, board.id)
        setWaitingScreenShown(false)
    }
    React.useEffect( () => {
        console.log('useEffect about to call getFullBoardLive')
        const unsub = getFullBoardLive(boardId, handleBoardLoaded)
        return unsub
    }, [boardId])

    // create or edit entry
    const [addDialogOpen, toggleAddDialog] = React.useState(false)
    const handleCloseAdd = () => toggleAddDialog(false)
    const handleOpenAdd = () => { 
        setDialogInEditMode(false)
        toggleAddDialog(true)
    }
    const handleEditEntry = (entryId: string) => { 
        console.log('trying to edit entry: ' + entryId)
        setDialogInEditMode(true)
        const entry = activeBoard.entries?.filter( (e) => e.id == entryId)[0]
        setEditedEntryContent({body: entry.body, gif:entry.gif, id: entryId})
        toggleAddDialog(true)
    }

    const [dialogInEditMode, setDialogInEditMode] = React.useState(false)
    const [editedEntryContent, setEditedEntryContent] = React.useState({body: '', gif:'',id:''})

    const confirmEntry = async (message: string, gif?: string) => {
        if (dialogInEditMode)
            await updateEntry(boardId, editedEntryContent.id,{body:message, gif:gif})
        else
            await createEntry(boardId,{body:message, gif:gif})
            const newEntry = { boardId, boardTitle: activeBoard.title, body:message, gif:gif}
            setLoginState({...loginState, 
                user: {...loginState.user, 
                    entries: loginState.user.entries ? [...loginState.user.entries, newEntry] : [newEntry]
                }
            })

        toggleAddDialog(false)
    }

    // remove entry
    const [alertDialogOpen, setAlertDialogOpen] = React.useState(false)
    const [waitingScreenShown, setWaitingScreenShown] = React.useState(true)
    const [entryIdPendingRemoval, setEntryIdPendingRemoval] = React.useState<string>()
    const handleRemoveEntry = (entryId: string) => {
        setEntryIdPendingRemoval(entryId)
        setAlertDialogOpen(true)
    }
    const handleConfirmAlert = async () => {
        setAlertDialogOpen(false)
        console.log('trying to remove entry: '+entryIdPendingRemoval)
        setWaitingScreenShown(true)
        await removeEntry(boardId, entryIdPendingRemoval)
        setWaitingScreenShown(false)
    }
    const handleCancelAlert = () => {
        setAlertDialogOpen(false)
        setEntryIdPendingRemoval(undefined)
    }


    // masonry customization
    const masonryBreakpoints = {
        default: activeBoard.entries?.length < 3 ? activeBoard.entries?.length : 3, 
        1400: activeBoard.entries?.length < 2 ? activeBoard.entries?.length : 2,
        1000: 1
    }
    const masonryColumnClassName = activeBoard.entries?.length > 1 ? 'entries-masonry-column' : 'entries-masonry-column-single'

    // logged in components
    const loggedInExtras = <>
        { addDialogOpen && <AddEntryDialog
            editMode={dialogInEditMode}
            prefillEntry={editedEntryContent}
            confirmEntry={confirmEntry}
            handleClose={handleCloseAdd}
        />}
        { alertDialogOpen && <AlertDialog 
            title="Confirm deletion"
            text="Are you sure you want to permanently delete this entry?" 
            handleCancel = {handleCancelAlert}
            handleConfirm = {handleConfirmAlert}
        />} 
        <div id="addEntryParent">
            <div id="addEntry" onClick={handleOpenAdd}>
                <a onClick={(e) => {e.preventDefault();}} href="#"><GrChapterAdd/></a>
            </div>
        </div> 
    </>

    return <div id="topOfBoard">
        <Loading show={waitingScreenShown}/>
        <h1>{activeBoard.title}</h1>
        { loginState.user && loggedInExtras }
        <Masonry className="entries" breakpointCols={masonryBreakpoints} columnClassName={masonryColumnClassName}>
            {activeBoard.entries?.map((entry: IEntry, index: number) =>
                <Entry key={index} entry={entry} handleEditEntry={handleEditEntry} handleRemoveEntry={handleRemoveEntry} />
             )}
        </Masonry>
        <div id="boardStarter">This board was first started by {activeBoard.creator.nickname}.</div>
    </div>
}


function Entry({entry, handleEditEntry, handleRemoveEntry}: {
    entry: IEntry,
    handleEditEntry: (e: string) => void,
    handleRemoveEntry: (e: string) => void
}) {
    const [loginState, ] = React.useContext(LoginContext)

    return (
    <div className="entry">
        { (loginState.user && loginState.user.id == entry.creator.id) &&
        <div className="entry_icons">
            <a href="#" onClick={(e) => {e.preventDefault(); handleEditEntry(entry.id)}}><AiFillEdit/></a>
            <a href="#" onClick={(e) => {e.preventDefault(); handleRemoveEntry(entry.id)}}><FaTrash/></a>
        </div> 
        }
        { entry.gif && <div className="entry_gif"><img src={entry.gif}/></div> }
        <div className="entry_body">{entry.body.split('\n').map( (line,key) => <p key={key}>{line}<br/></p>)}</div>
        <div className="entry_creator">From: {entry.creator.nickname}</div>
    </div>
    )
}
