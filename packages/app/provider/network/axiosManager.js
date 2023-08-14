import Axios from "axios"

export const axiosBase = Axios.create({
    baseURL: 'https://application-45.10msymcdmaxj.us-east.codeengine.appdomain.cloud/api',
    headers: {
        'accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})

export const AppRoutes = {
    ALL_ROADMAP: "/roadmap/all/",
    ROADMAP: "/roadmap/",
    ROADMAP_INFO: "/roadmap/info/",
    ROADMAP_PAPERS: "/roadmap/papers/",
    ROADMAP_RATING: "/roadmap/rating",
    SEARCH_ROADMAPS: "/search/roadmap/",
    ROADMAP_CLONE: "/roadmap/clone",

    USER_LEARNING_LIST: "/user/learning_list",
    USER: "/user/",

    PAPER: "/paper/",

}

export async function getRequest({ url, userToken, params }) {
    const response = await axiosBase.get(url, {
        headers: {
            'Authorization': 'Bearer ' + userToken,
        },
        params
    }).catch((err) => {
        console.log("Fetching", url, "Errored with", err.message)
        throw err
    })
    if (response.status == 200) {
        return response.data
    } else {
        // throw new Error("Request failed with" + response.statusText)
    }
}

export async function postRequest({ url, userToken, params, body }) {
    const response = await axiosBase.post(url, body, {
        headers: {
            'Authorization': 'Bearer ' + userToken,
        },
        params
    }).catch((err) => {
        console.log("Posting", url, "Errored with", err.message)
        throw err
    })
    if (response.status == 200) {
        return response.data
    } else {
        // throw new Error("Request failed with" + response.statusText)
    }
}

export async function putRequest({ url, userToken, params, body }) {
    const response = await axiosBase.put(url, body, {
        headers: {
            'Authorization': 'Bearer ' + userToken,
        },
        params
    }).catch((err) => {
        console.log("Putting", url, "Errored with", err.message)
        throw err
    })
    if (response.status == 200) {
        return response.data
    } else {
        // throw new Error("Request failed with" + response.statusText)
    }
}

export async function deleteRequest({ url, userToken, params }) {
    const response = await axiosBase.delete(url, {
        headers: {
            'Authorization': 'Bearer ' + userToken,
        },
        params
    }).catch((err) => {
        console.log("Deleting", url, "Errored with", err.message)
        throw err
    })
    if (response.status == 200) {
        return response.data
    } else {
        // throw new Error("Request failed with" + response.statusText)
    }
}