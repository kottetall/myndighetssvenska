require("dotenv").config()
const { PORT } = process.env
const Express = require("express")
const app = Express()

app.use(Express.static("public"))

app.listen(PORT, () => {
    console.log(`Uppe på ${PORT}`)
})

app.get("/arbetsformedlingen", (request, response) => {
    response.send("Här är något test om AF")
})