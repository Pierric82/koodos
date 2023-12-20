import * as React from "react"

export function useNavigationState(): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [activeBoardId, setActiveBoardId] = React.useState<string>(window.location.hash ? window.location.hash.substring(1) : '')

    function readHash() {
        console.log('setting board id from URL')
        setActiveBoardId(window.location.hash ? window.location.hash.substring(1) : '')
    }
    
    React.useEffect( () => {
        window.addEventListener('hashchange', readHash)
        return () => removeEventListener('hashchange', readHash)
    },[])

    return [activeBoardId, setActiveBoardId]
}

export function updateNavigation(pageTitle: string, boardId: string) {
    if (window.location.hash.replace(/#/,'') != boardId) {
    // change of URL
        history.pushState(null,'Koodos - '+pageTitle,'#'+boardId)
        document.title = 'Koodos - '+pageTitle; // in case not supported in pushState
    } else {
    // no URL change, just ensure title is up to date and default hash is there
        if (window.location.hash == '') history.replaceState(null,null,'#')
        if (document.title != 'Koodos - '+pageTitle)
            document.title = 'Koodos - '+pageTitle
    }
}
