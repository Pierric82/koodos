
import { CircularProgress } from "@mui/material"
import * as React from "react"

export default function Loading({show=true}) {
    return show ? 
        <div className='loading-backdrop'>
            <div className='loading-container'>
                <CircularProgress size='6rem'/>
            </div> 
        </div>
    : <></>
}
