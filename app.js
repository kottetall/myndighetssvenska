require("dotenv").config()

const { DB_URL, DB_USER, DB_PASSWORD, DB_DATABASE, DB_TABLE_BEGREPP, DB_TABLE_ORGANISATIONER, DB_TABLE_FORKLARINGAR } = process.env
const mysql = require("mysql")
const dbOptions = {
    host: DB_URL,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
}
const dbConnection = mysql.createConnection(dbOptions)

const { PORT } = process.env
const Express = require("express")
const app = Express()
const helmet = require("helmet")
const { response } = require("express")

app.use(helmet())
app.use(Express.static("public"))

app.listen(PORT, () => {
    console.log(`Uppe på ${PORT}`)
})

app.get("/search", async (request, response) => {
    const { begrepp } = request.query
    const searchresults = await new Promise((resolve, reject) => {
        dbConnection.query(`SELECT * FROM ${DB_TABLE_BEGREPP} JOIN ${DB_TABLE_FORKLARINGAR} ON begreppId = ${DB_TABLE_FORKLARINGAR}.forklaringBegreppId JOIN ${DB_TABLE_ORGANISATIONER} ON ${DB_TABLE_FORKLARINGAR}.forklaringOrganisationId = ${DB_TABLE_ORGANISATIONER}.organisationId WHERE begreppText LIKE ?;`, [`${begrepp}%`], (error, results, fields) => {
            if (error) console.error(error)
            else resolve(results)
        })
    })

    console.log(searchresults)

    if (searchresults.length === 0) response.send([])
    else {
        // response.send(searchresults)
        const oldStyleResults = convertResultsToOldFormat(begrepp, searchresults)
        response.send(oldStyleResults).status(200)

    }
})

class Forklaring {
    constructor(mysqlRowDataPacket) {
        const {
            begreppUppdaterad,
            begreppText,
            forklaringKlartext,
            forklaringOriginalText,
            forklaringOriginalKalla,
            forklaringOriginalVersaler,
            forklaringCustomText,
            forklaringRelateradeBegrepp,
            forklaringInhamtadAutomatiskt,
            organisationUppdaterad,
            organisationNamn,
            organisationForkortning,
            organisationHemsida,
            organisationLogga } = mysqlRowDataPacket

        return {
            meaning: forklaringKlartext || begreppText,
            explanation: forklaringOriginalText || "",
            info: {
                link: forklaringOriginalKalla
            },
            usage: [organisationNamn],
            relatedTerms: forklaringRelateradeBegrepp ? forklaringRelateradeBegrepp.split(",") : []
        }

    }
}


function convertResultsToOldFormat(sokString, newResults) {

    const oldWordList = {}

    for (let result of newResults) {
        const {
            begreppText: begrepp,
            forklaringKlartext: meaning,
            forklaringOriginalText: explanation,
            forklaringOriginalKalla: link_info,
            organisationNamn: usage_org,
            forklaringRelateradeBegrepp: relatedTerms
        } = result

        let duplicate = false

        if (!oldWordList[begrepp]) {
            oldWordList[begrepp] = [{
                "meaning": meaning,
                "explanation": explanation,
                "info": {
                    "link": link_info
                },
                "usage": [usage_org],
                "relatedTerms": relatedTerms || []
            }]
        } else {
            oldWordList[begrepp].forEach(post => {
                if (post.meaning === meaning) {
                    post.usage.push(usage_org)
                    if (relatedTerms) post.relatedTerms.push(relatedTerms.split(","))
                    if (explanation && post.explanation.length < explanation.length) {
                        post.explanation = explanation
                        post.info.link = link_info
                    }
                    duplicate = true
                }
            })

            if (!duplicate) {
                oldWordList[begrepp].push({
                    "meaning": meaning,
                    "explanation": explanation,
                    "info": {
                        "link": link_info
                    },
                    "usage": [usage_org],
                    "relatedTerms": relatedTerms || []
                })
            }
        }
    }

    let oldFound = []

    const valueExactRegex = new RegExp(`^${sokString}$`, "i")
    const valuePartialRegex = new RegExp(`^${sokString}`, "i")


    for (let abbreviation in oldWordList) {
        if (valueExactRegex.test(abbreviation)) {
            const package = { meanings: oldWordList[abbreviation] }
            package.abbreviation = abbreviation
            package.exact = true

            oldFound.push(package)
        } else if (valuePartialRegex.test(abbreviation)) {
            const package = { meanings: oldWordList[abbreviation] }
            package.abbreviation = abbreviation
            package.exact = false

            oldFound.push(package)
        }
    }

    return oldFound
}