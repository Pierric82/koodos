
import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle/DialogTitle"
import TextField from "@mui/material/TextField"
import DialogContent from "@mui/material/DialogContent"

export default function AddBoardDialog (
    {handleClose, confirmNewBoard}: {handleClose: ()=>void, confirmNewBoard: (name: string) => void}) {
    
    const [name,setName] = React.useState('')
    const [saveButtonEnabled,setSaveButtonEnabled] = React.useState(true)
    const nameChanged = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)
    const clickSave = () => {setSaveButtonEnabled(false); confirmNewBoard(name);} 

    return <Dialog maxWidth="sm" fullWidth={true} open={true} onClose={handleClose}> 
        <DialogTitle>Make a new board</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                required
                fullWidth
                margin="dense"
                id="newBoardBody"
                label="Board name"
                placeholder="What should the board be named?"
                onChange={nameChanged}
            />
            <DialogActions>
                <Button disabled={!saveButtonEnabled} onClick={clickSave}>Save</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}
