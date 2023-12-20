export interface IEntry {
    creator: {id: string, nickname:string},
    body: string,
    gif?: string,
    id?: string
}

export interface IBoard {
    id: string,
    creator: {
      id: string,
      nickname: string,
    },
    title: string,
    entries?: Array<IEntry>
  }


export interface IUser {
  id: string,
  nickname: string,
  boardsCreated?: Array<{
    id: string,
    title: string
  }>
  entries?: Array<{
    boardId: string,
    boardTitle: string,
    body: string,
    gif?: string
  }>,
  email?: string
}
