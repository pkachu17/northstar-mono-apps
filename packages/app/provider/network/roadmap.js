import { AppRoutes, deleteRequest, getRequest, postRequest, putRequest } from './axiosManager'
import { getUserDetails } from './users'

export async function getAllRoadmaps({ userToken, params = {
    page: 1,
    size: 10
} }) {
    const response = await getRequest({ url: AppRoutes.ALL_ROADMAP, userToken, params }).catch(err => {
        throw err
    })
    let promiseList = []
    response.items.map(async (roadmap) => {
        promiseList.push(getUserDetails({ firebaseUserID: roadmap.userUID }))
    })
    const allUsers = await Promise.all(promiseList)
    return {
        roadmapData: response.items.map((value, index) => {
            return convertUIDToAuthor(value, allUsers[index])
        }),
        page: response.page
    }


    // return response.items
}

export async function getRoadmapInfo({ userToken, roadmapID, params = {} }) {
    const response = await getRequest({ url: AppRoutes.ROADMAP_INFO + roadmapID, userToken, params }).catch(err => {
        throw err
    })
    const userDetails = await getUserDetails({ firebaseUserID: response.author })
    return convertUIDToAuthor(response, userDetails)
}

export async function getMyRoadmaps({ userToken, userID, params = {} }) {
    params.filterUser = userID
    params.size = 50

    // TODO: - This doesnt work. Ask backend team about this.
    const response = await getAllRoadmaps({ userToken, params }).catch(err => console.error(err))
    const filteredRoadmaps = response.roadmapData.filter(item => item.userUID === userID)
    return filteredRoadmaps
}

export async function getSearchRequest({ userToken, query, params = {
    page: 1,
    size: 20
} }) {
    const response = await getRequest({ url: AppRoutes.SEARCH_ROADMAPS + query, userToken, params }).catch(err => {
        throw err
    })
    let promiseList = []
    response.items.map(async (roadmap) => {
        promiseList.push(getUserDetails({ firebaseUserID: roadmap.userUID }))
    })
    const allUsers = await Promise.all(promiseList)
    return {
        items: response.items.map((value, index) => {
            return convertUIDToAuthor(value, allUsers[index])
        }),
        page: response.page
    }
    return response
}

export async function createNewRoadmap({ userToken, name, description, tags, levels }) {
    const requestBody = {
        name,
        description,
        tags,
        levels,

        // In future we can have private roadmaps as well
        public: true,

        // Remember to have a switch between Adult and Child
        roadMapType: "adult"
    }
    const params = {

    }
    const response = await postRequest({ url: AppRoutes.ROADMAP, userToken, body: requestBody, params }).catch(err => {
        throw err
    })
    return response
}

export async function updateRoadmap({ userToken, roadmapInfo }) {
    const requestBody = {
        ...roadmapInfo
    }
    const params = {
        roadmap_id: roadmapInfo.uid
    }
    const response = await putRequest({ url: AppRoutes.ROADMAP, userToken, body: requestBody, params }).catch(err => {
        throw err
    })
    return response.data
}

export async function deleteRoadmap({ userToken, roadmapInfo }) {
    const response = await deleteRequest({ url: AppRoutes.ROADMAP + roadmapInfo.uid, userToken, }).catch(err => {
        throw err
    })
    return response
}

export async function cloneRoadmap({ userToken, roadmapID }) {
    const params = {
        roadmap_id: roadmapID
    }
    const response = await postRequest({ url: AppRoutes.ROADMAP_CLONE, userToken, params }).catch(err => {
        throw err
    })
    console.log("Cloning roadmap response", response)
    return response.clonedUID
}

export function convertUIDToAuthor(roadmap, userDetail) {
    return {
        ...roadmap,
        author: userDetail.name
    }
}

export async function updateRoadmapRating({ userToken, roadmapID, rating }) {
    console.log("Roadmap ", roadmapID, "rating", rating)
    const response = await postRequest({
        url: AppRoutes.ROADMAP_RATING,
        userToken,
        params: {
            roadmap_id: roadmapID
        },
        body: {
            rating
        }
    }).catch(err => {
        console.log("Errored rating roadmap", err)
        if (err.response) {
            throw err.response.data
        }
    })
    console.log("Roadmap rating status", response)
    if (response.code == 200) {
        return response
    } else {
        console.error("Roadmap rating update status", response)
    }
}