import Axios from 'axios'

const axiosBase = Axios.create({
    baseURL: 'https://api.openalex.org/',
    headers: {
        'accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})

const OARoutes = {
    autoCompletePaper: "autocomplete/works",
    works: "works/"
}

export async function getAutoComplete({ query }) {
    const params = {
        "q": query
    }
    let response = await axiosBase.get(OARoutes.autoCompletePaper, {
        params
    }).catch(err => {
        console.error("Axios Request failed to fetch Open Alex", err)
    })
    return response.data.results
}

export async function getPaperFromOA({ paperID }) {
    let response = await axiosBase.get(OARoutes.works + paperID)
        .catch(err => {
            console.log("Axios Request failed to fetch Open Alex")
        })
    return response.data
}