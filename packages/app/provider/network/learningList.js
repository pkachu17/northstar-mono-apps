import { axiosBase, AppRoutes, getRequest } from './axiosManager'
import { convertUIDToAuthor } from './roadmap'
import { getUserDetails } from './users'

export async function getLearningList({ userToken, params = {} }) {
    const response = await getRequest({ url: AppRoutes.USER_LEARNING_LIST, userToken, params }).catch(err => {
        throw err
    })
    if (response.code == 200) {
        let promiseList = []
        response.data.learning_list.map(async (roadmap) => {
            promiseList.push(getUserDetails({ firebaseUserID: roadmap.userUID }))
        })
        const allUsers = await Promise.all(promiseList)
        const total = response.data.learning_list.map((value, index) => {
            return convertUIDToAuthor(value, allUsers[index])
        })
        return total
    } else {
        throw new Error("Request failed with" + response.statusText)
    }

}

// TODO: Rework Axios Base request
export async function addRoadmapToLearningList({ userToken, roadmapID }) {
    const response = await axiosBase.post(AppRoutes.USER_LEARNING_LIST, null, {
        headers: {
            'Authorization': 'Bearer ' + userToken,
        },
        params: {
            'roadmap_id': roadmapID
        }
    }).catch((err) => {
        console.log("Fetching", url, "Errored with", err.message)
        throw err
    })
    if (response.code == 200) {
        return response.data
    } else {
        // throw new Error("Request failed with" + response.statusText)
    }
}

// TODO: Rework Axios Base request
export async function deleteRoadmapFromLearningList({ userToken, roadmapID }) {
    const response = await axiosBase.delete(AppRoutes.USER_LEARNING_LIST, {
        headers: {
            'Authorization': 'Bearer ' + userToken,
        },
        params: {
            'roadmap_id': roadmapID
        }
    }).catch((err) => {
        console.log("Fetching", url, "Errored with", err.message)
        throw err
    })
    if (response.code == 200) {
        return response.data
    } else {
        // throw new Error("Request failed with" + response.statusText)
    }
}  