require("dotenv").config()
const { PORT } = process.env
const Express = require("express")
const app = Express()

app.use(Express.static("public"))

app.listen(PORT, () => {
    console.log(`Uppe på ${PORT}`)
})