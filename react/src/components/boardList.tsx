
import * as React from "react"
import {FaTrash} from 'react-icons/fa'

import { createBoard, deleteBoard } from "../services/backend"
import { LoginContext, LoginState } from "../services/loginContext"
import { updateNavigation } from "../services/navigation"
import AddBoardDialog from "./addBoard"
import AlertDialog from "./alertDialog"

interface UserBoard { id: string, title: string }
interface UserEntry { boardId: string, boardTitle: string, body: string }

export default function BoardListComponent({selectBoard }:
    {selectBoard: (arg0: string)=>void}) { 

    const [loginState, setLoginState] = React.useContext(LoginContext)
    updateNavigation('home','')

    // main loading, data fetching and state management
    const [ownBoardList, setOwnBoardList] = React.useState<UserBoard[]>([])
    const [participatedBoardList, setParticipatedBoardList] = React.useState<UserBoard[]>([])
    const [loaded, setLoaded] = React.useState(false)

    React.useEffect( () => {
        const fetchBoards = async () => {
            try {
                setOwnBoardList(loginState.user.boardsCreated || [])
                const seenIds = new Set()
                const participatedBoards : UserBoard[] = []
                loginState.user.entries?.forEach( (e: UserEntry) => {
                    if (seenIds.has(e.boardId)) return
                    participatedBoards.push({id:e.boardId, title: e.boardTitle})
                    seenIds.add(e.boardId)
                })
                setParticipatedBoardList(participatedBoards)
            } catch (e) { console.log('Error while processing user board list'); }
            setLoaded(true)
        }
        fetchBoards()
    }, [loginState.loggingIn])

    // board creation handler
    const confirmNewBoard = async (name: string) => {
        const newBoardId : string = await createBoard(name)
            setOwnBoardList(ownBoardList.concat([{id:newBoardId,title:name}]))
        const newState: LoginState = JSON.parse(JSON.stringify(loginState))
        if (!loginState.user.boardsCreated) 
            newState.user.boardsCreated = []
        newState.user.boardsCreated = [...newState.user.boardsCreated, {id:newBoardId, title:name}]
        setLoginState(newState)
    }

    // board deletion handler
    const confirmBoardDeletion = async (id: string) => {
        deleteBoard(id)
        setOwnBoardList(ownBoardList.filter(b => b.id != id))
        setParticipatedBoardList(participatedBoardList.filter(b => b.id != id))
        const newState: LoginState = JSON.parse(JSON.stringify(loginState))
        newState.user.boardsCreated = newState.user.boardsCreated?.filter(b => b.id != id)
        newState.user.entries = newState.user.entries?.filter(e => e.boardId != id)
        setLoginState(newState)
    }
    
    // output
    if (loginState.user && loaded) 
        return (
            <div id="boardList">
                <OwnBoardList
                    ownBoardList={ownBoardList}
                    selectBoard={selectBoard}
                    confirmNewBoard={confirmNewBoard}
                    confirmBoardDeletion={confirmBoardDeletion}
                    loginState={loginState}
                />
                <ParticipatedBoardList
                    participatedBoardList={participatedBoardList}
                    selectBoard={selectBoard}
                />
            </div>
        )
    else
        return <></>
}

function OwnBoardList({ownBoardList, confirmNewBoard, confirmBoardDeletion, selectBoard, loginState} : {
    ownBoardList: UserBoard[], 
    confirmNewBoard: (name: string) => Promise<void>,
    confirmBoardDeletion: (id: string) => Promise<void>,
    selectBoard: (boardId: string) => void, 
    loginState: LoginState
}) {
    
    // add board dialog state and handlers
    const [addDialogOpen, setAddDialogOpen] = React.useState(false)
    const handleCloseAdd = () => setAddDialogOpen(false)
    const handleOpenAdd = () => setAddDialogOpen(true)
    const confirmNewBoardAndCloseDialog = (name: string) => {confirmNewBoard(name); setAddDialogOpen(false); }

    // delete board dialog state and handlers
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [deletionCandidate, setDeletionCandidate] = React.useState<UserBoard>(null)
    const confirmBoardDeletionAndCloseDialog = () => {confirmBoardDeletion(deletionCandidate.id); setDeleteDialogOpen(false); }
    const openDeletionDialog = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, board: UserBoard) => { 
        e.preventDefault()
        setDeletionCandidate(board)
        setDeleteDialogOpen(true)
    }

    //output
    let listPart = <></>
    if (ownBoardList?.length > 0)
        listPart = <div>
                        <p className="intro">Here's the list of boards you have created:</p>
                        <ul>
                            { ownBoardList.map( (board: UserBoard, index: number) =>
                                 <li key={"board"+index}>
                                     <a href="#" onClick={e => openDeletionDialog(e, board)}><FaTrash /></a>&nbsp;
                                     <a href="#" onClick={() => selectBoard(board.id)}>{board.title}</a> 
                                </li> ) }
                        </ul>
                    </div>
    
    let createPrompt = <p className="intro">It's time to create your <a href="#" onClick={handleOpenAdd}>first board</a>!</p>
    if (ownBoardList?.length > 0)
        createPrompt = <p className="intro">You can also create <a href="#" onClick={handleOpenAdd}>another board</a>.</p>

    return (
        <div className='boardListPanel' id="ownBoards">
            <p className="intro">Hi, {loginState.user.nickname} !</p>
            {addDialogOpen && <AddBoardDialog confirmNewBoard={confirmNewBoardAndCloseDialog} handleClose={handleCloseAdd}/>}
            {deleteDialogOpen && <AlertDialog
                text={`Are you sure you want to delete the board named  "${deletionCandidate.title}" and everyone's entries in it? There is no coming back froms this.`}
                title="Confirm board deletion?"
                handleCancel={() => setDeleteDialogOpen(false)}
                handleConfirm={confirmBoardDeletionAndCloseDialog}
            />}
            {listPart}
            {createPrompt}
        </div>
    )
}

function ParticipatedBoardList({participatedBoardList, selectBoard} : 
    {participatedBoardList: UserBoard[], selectBoard: (boardId: string) => void }) {

    if (participatedBoardList && (participatedBoardList.length > 0))
        return (
            <div className='boardListPanel' id="participatedBoards">
                <p className="intro">You have participated in the following boards:</p>
                <ul>
                    { participatedBoardList.map( (board: UserBoard, index: number) =>
                        <li key={"pboard"+index}>
                            <a href="#" onClick={() => selectBoard(board.id)}>{board.title}</a>
                        </li>
                    )}
                </ul>
            </div>
        )
    else return <></>
}
