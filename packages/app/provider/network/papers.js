import { AppRoutes, getRequest, postRequest, deleteRequest, putRequest } from './axiosManager'

export async function getPapersForRoadmap({ userToken, roadmapID, params = {} }) {
    const response = await getRequest({ url: AppRoutes.ROADMAP_PAPERS + roadmapID, userToken, params }).catch(err => {
        throw err
    })
    return response
}

export async function addPaperToRoadmap({ userToken, roadmapID, difficulty, level, paperName, paperLink }) {
    const requestBody = {
        name: paperName,
        // TODO: - Add paper published date
        publish: "",
        roadmaps: [
            {
                rm: roadmapID,
                difficulty,
                level
            }
        ],
        link: paperLink
    }
    console.log("RequestBody", requestBody)
    const response = await postRequest({ url: AppRoutes.PAPER, userToken, body: requestBody }).catch(err => {
        throw err
    })
    console.log("Response", response)
    return response
}

export async function updatePaperToRoadmap({ userToken, paperID, roadmapID, difficulty, level, paperName, paperLink }) {
    const requestBody = {
        name: paperName,
        // TODO: - Add paper published date
        publish: "",
        roadmaps: {
            rm: roadmapID,
            difficulty,
            level
        },
        link: paperLink
    }
    const params = {
        paper_id: paperID,
        roadmap_uid: roadmapID,
        del_flag: false
    }
    const response = await putRequest({ url: AppRoutes.PAPER, params, userToken, body: requestBody }).catch(err => {
        throw err
    })
    console.log("Response", response)
    return response
}

export async function deletePaperFromRoadmap({ userToken, roadmapID, paperID }) {
    const params = {
        paper_id: paperID,
        roadmap_id: roadmapID
    }
    console.log("Params", params)
    const response = await deleteRequest({ url: AppRoutes.PAPER, userToken, params }).catch(err => {
        throw err
    })
    console.log("Response for delete", response)
    return response

}