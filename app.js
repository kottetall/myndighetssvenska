require("dotenv").config()
const { PORT } = process.env
const Express = require("express")
const app = Express()
const helmet = require("helmet")

app.use(helmet())
app.use(Express.static("public"))

app.listen(PORT, () => {
    console.log(`Uppe på ${PORT}`)
})