import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'

const app = express()
const port = 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
    const { url, path: routePath } = req
    console.log('Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').')
    next()
})

app.use('/', express.static(join(__dirname, '')))

app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
})