
let a = window.location.origin.split(':3000')

const URL = a[0] + ':3030/'

// ADD USERS TO URL

export const getUser = (token) => {
    return fetch(`${URL}users/getUser/${token}`)
        .then(res => res.json())
}

export const initUser = (username, uuid) => {
    return fetch(`${URL}users/initUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, uuid })
    })
        .then(res => res.json())
}

export const leaveUser = (user) => {
    return fetch(`${URL}users/leaveUser/${user?.token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user })
    })
        .then(res => res.json())
}

// GAME SERVICE

export const getGame = (gameId, token) => {
    return fetch(`${URL}game/getGame/${gameId}/${token}`)
        .then(res => res.json())
}

export const setInBoard = (tile, index, currPlayerName, gameId) => {
    let data = {
        tile,
        index,
        currPlayerName,
        gameId
    }

    return fetch(`${URL}game/setInBoard`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
    })
        .then(res => res.json())
}





// ADD GAME TO URL

export const enterRoom = (token, option) => {
    return fetch(`${URL}game/enterRoom/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ option: option })
    })
        .then(res => res.json())
}

export const leaveRoom = (token) => {
    return fetch(`${URL}game/leaveRoom/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(res => res.json())
}



// CHAT SERVICES

export const sendMessage = (token, message) => {
    return fetch(`${URL}chat/sendMessage/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    })
        .then(res => res.json())
}