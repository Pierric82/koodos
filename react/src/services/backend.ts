import {IBoard, IUser} from "../interfaces/interfaces"

const PocketBase = require('pocketbase/cjs')

interface UserBoard { id: string, title: string }

declare const POCKETBASE_URL: string; // define from env at compile time via webpack config
export const pb = new PocketBase(POCKETBASE_URL)


export async function getFullUser(userId: string, displayName?: string): Promise<IUser> {
  console.log('getFullUser triggering')
  const u = await pb.collection('users').getOne(userId, { expand: "boards(creator)" })
  const entries = await pb.collection('entries').getFullList({filter: `creator = "${userId}"`, sort: 'created', expand: 'board'})
  if (!u.name) {
    console.log('user not found, setting it to ',displayName || userId)
    await pb.collection('users').update(userId, {"name": displayName || userId})
    return {id: userId, nickname: (displayName || userId)}
  }
  return {
    id: userId,
    nickname: u.name,
    email: u.email,
    boardsCreated: u.expand?.['boards(creator)']?.map( (b: UserBoard) => ({id: b.id, title: b.title})),
    entries: entries?.map( (e: any) => ({boardId: e.expand?.board?.id, boardTitle: e.expand?.board?.title, body: e.body}))
  }
}


export async function createBoard(boardTitle: string): Promise<string> {
  console.log('creating board: '+boardTitle)

  try {
    const boardRef = await pb.collection('boards').create({
      title: boardTitle,
      creator: pb.authStore.model.id,
    })
    // commented out until sure it is no longer needed since we retrieve boards using PB's backwards expand
    // await pb.collection('users').update(pb.authStore.model.id, { 'boards_created+': boardRef.id })
    return boardRef.id
  }
  catch (error) {
    console.log('error creating board! ' + error)
    return null
  }
}


export function getFullBoardLive(boardId: string, callback: (board: IBoard) => void ) {
  console.log('getFullBoardLive activated once')
  const get_board_and_callback = async (boardId: string) => {
    try {
      const d = await pb.collection('boards').getOne(boardId, { expand: 'creator' })
      const entries = await pb.collection('entries').getFullList({filter: `board = "${boardId}"`, sort: 'created', expand: 'creator'})
      const updatedBoard = {
        id: boardId,
        creator: { id: d.expand.creator.id, nickname: d.expand.creator.name},
        title: d.title,
        entries: entries?.map( (e: any) => ({creator: {id: e.expand.creator.id, nickname: e.expand.creator.name},body:e.body, id: e.id ? e.id : '', gif: e.gif ? e.gif : ''}))
      }
      console.log('logging raw record below')
      console.log(d)
      console.log('logging updated board below')
      console.log(updatedBoard)
      callback(updatedBoard)
    }
    catch (error) {
      console.log('error in board retrieval! ' + error)
    }
  }
  pb.collection('boards').subscribe(boardId, async (e: any) => {
    console.log('getFullBoardLive snapshot callback triggered')
    get_board_and_callback(e.record.id)
  })
  get_board_and_callback(boardId)

  return () => pb.collection('boards').unsubscribe(boardId)
}

export async function updateEntry(boardId: string, entryId: string, entry: {body: string, gif?: string}) {
  try {
    await pb.collection('entries').update(entryId, entry)
    await pb.collection('boards').update(boardId, {})
  } catch(error) {
    console.log("error updating entry: " +error.message)
  }
}

export async function createEntry(boardId: string, entry: {body: string, gif?: string}) {
  console.log('creating new entry')
  try {
      await pb.collection('entries').create({body: entry.body, gif: entry.gif, board: boardId, creator: pb.authStore.model.id})
      await pb.collection('boards').update(boardId, {})
  } catch(error) {
      console.log("error in createEntry: " +error.message)
  }
}

export async function removeEntry(boardId: string, entryId: string) {
  console.log('deleting entry')
  try {
      await pb.collection('entries').delete(entryId)
      await pb.collection('boards').update(boardId, {})
  } catch(error) {
      console.log("error in createEntry: " +error.message)
  }
}

export async function deleteBoard(boardId: string) {
  console.log('deleting board ' + boardId)
  try {
      await pb.collection('boards').delete(boardId)
  } catch(error) {
      console.log("error in createEntry: " +error.message)
  }
}
