
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


// ADD GAME TO URL

export const createRoom = (token) => {
    return fetch(`${URL}game/createRoom/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(res => res.json())
}

export const joinRoom = (token, gameId, roomId) => {
    let data = {
        gameId,
        roomId
    }

    return fetch(`${URL}game/joinRoom/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
    })
        .then(res => res.json())
}


export const randomRoom = (token) => {
    return fetch(`${URL}game/randomRoom/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
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