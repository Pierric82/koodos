
import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle/DialogTitle"
import TextField from "@mui/material/TextField"
import DialogContent from "@mui/material/DialogContent"
import { Grid } from "@giphy/react-components"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { IGif } from "@giphy/js-types"
import IconButton from "@mui/material/IconButton"
import CloseIcon from '@mui/icons-material/Close'
import Stack from "@mui/material/Stack"
import { Theme } from "@mui/material"

declare let GIPHY_API_KEY: string; // declared from env variable via webpack config
const giphyFetch = new GiphyFetch(GIPHY_API_KEY)

function GiphyDialog({handleResult, changeMode}: {handleResult:(url: string)=>void, changeMode:boolean}) {
    const [gifSearch, setGifSearch] = React.useState('')
    const fetchGifs = (offset: number) =>
        giphyFetch.search( gifSearch, {offset, limit: 10 })
    const onGifClick=(gif: IGif,e:React.SyntheticEvent<HTMLElement, Event>) => {
        e.preventDefault()
        console.log('clicked this gif',gif)
        handleResult(gif.images.original.url)
    }

    return <Dialog PaperProps={{ sx: { width: "550px", height: "100%" } }}
    fullWidth  open>
        <DialogTitle>
            Select a {changeMode ? 'new' : ''} GIF
            <IconButton
                aria-label="close"
                onClick={() => handleResult(null)}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme: Theme) => theme.palette.grey[500],
                }}
                >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <TextField
                id="gifSearch"
                label="search for GIF"
                placeholder="What kind of GIF are you after?"
                value={gifSearch}
                autoFocus
                fullWidth
                margin="dense"
                onChange={(e) => {setGifSearch(e.target.value)} }
            />
            <Grid key={gifSearch} onGifClick={onGifClick} width={500} fetchGifs={fetchGifs} columns={3} gutter={6} />
            <DialogActions>
                <Button onClick={() => handleResult(null)}>Cancel</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}

export default function AddEntryDialog ({handleClose, confirmEntry, prefillEntry, editMode}:
{handleClose: ()=>void, confirmEntry: (message:string, gif?: string) => void,
prefillEntry: {body: string, gif?: string}, editMode: boolean}) {

    const [message, setMessage] = React.useState(editMode ? prefillEntry.body : '')
    const messageChanged = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value)
    const [saveButtonEnabled,setSaveButtonEnabled] = React.useState(true)
    const clickSave = () => { setSaveButtonEnabled(false); confirmEntry(message, selectedGif);}
    const [showingGiphy, setShowingGiphy] = React.useState(false)
    const [selectedGif, setSelectedGif] = React.useState(editMode ? prefillEntry.gif : '')
    const handleGiphyResult = (url: string): void => {
        setShowingGiphy(false)
        if (url) setSelectedGif(url)
    }
    const handleClearGif = () => {setSelectedGif(null);}
 
    return <Dialog maxWidth="md" fullWidth={true} open={true} > 
        {showingGiphy ? <GiphyDialog changeMode={selectedGif != ''} handleResult={handleGiphyResult} /> : ''}
        <DialogTitle>{editMode ? 'Edit entry' : 'Make a new entry'}</DialogTitle>
        <DialogContent>
            {selectedGif ? <div id="newEntryGifContainer"><img src={selectedGif}/></div> : '' }
            <Stack direction="row" spacing={1}>
                <Button fullWidth onClick={()=>setShowingGiphy(true)} variant="outlined">{selectedGif ? 'Change' : 'Add a'} GIF</Button>
                {selectedGif ? <Button onClick={handleClearGif} variant="outlined" fullWidth>Remove GIF</Button> : ''}
            </Stack>
            <TextField
                id="newEntryBody"
                label="Message"
                placeholder="Type your message here."
                value={message}
                multiline minRows="10" maxRows="50"
                autoFocus
                required
                fullWidth
                margin="dense"
                onChange={messageChanged}
            />
            <DialogActions>
                <Button disabled={!saveButtonEnabled} onClick={clickSave}>Save</Button>
                <Button disabled={!saveButtonEnabled} onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}
