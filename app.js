const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
var express = require("express")
var compression = require("compression")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var morgan = require("morgan")
const moment = require("moment")
var ServiceRoutes = require("./routes/ServiceRoutes")
require("./library/dbConnection")
const cors = require("cors")
const SecurityHandlers = require("./helpers/SecurityHandlers")
const auditContext = require("./middlewares/auditContextMiddleware")
// var expressValidator = require("express-validator")
var app = express()

var server = require("http").createServer(app)

app.use(compression())

app.use(cors())
app.use(
    bodyParser.text({
        type: "application/xml",
        limit: "10mb"
    })
)
app.use(
    bodyParser.json({
        extended: true,
        limit: "10mb"
    })
)
app.use(auditContext)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET,POST")
    res.header("Access-Control-Expose-Headers", "Content-Length")
    res.header("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, <X-Requested-Wi></X-Requested-Wi>th")
    if (req.method === "OPTIONS") {
        return res.json(200)
    } else {
        return next()
    }
})

app.use(function (req, res, next) {
    req.ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress
    return next()
})

// app.use(expressValidator())

var __keyDisAllow = ["img", "image"]
const __shortenResponseData = (resBodiDatas) => {
    for (let _keyResBody in resBodiDatas) {
        if (__keyDisAllow.includes(_keyResBody)) {
            resBodiDatas[_keyResBody] = String(resBodiDatas[_keyResBody]).substring(0, 100) + "....."
        }
    }
    return resBodiDatas
}

const originalSend = app.response.send
app.response.send = function sendOverWrite(body) {
    originalSend.call(this, body)
    body = JSON.parse(body)
    if (body.success && body.data) {
        if (Array.isArray(body.data)) {
            for (let _keyResBody in body.data) {
                body.data[_keyResBody] = __shortenResponseData(body.data[_keyResBody])
            }
        } else {
            body.data = __shortenResponseData(body.data)
        }
    }
    this.__custombody__ = body
}

morgan.token("timestamp", () => moment().format("YYYY-MM-DD HH:mm:ss"))
morgan.token("req-param", (req, res) => JSON.stringify(req.param))
morgan.token("req-body", (req, res) => {
    var _oriBd = __shortenResponseData(req.body)
    return JSON.stringify(_oriBd)
})
morgan.token("res-body", (_req, res) => JSON.stringify(res.__custombody__))
// COMMENT FOR API FAC DEVICE
// morgan.token("res-body", (_req, res) => JSON.stringify({ hehe: "heheh" }))
// app.use(morgan(":timestamp :remote-addr :remote-user :method :url :status | param :req-param | body: :req-body | res: :res-body :response-time ms"))
app.use(
    morgan(":timestamp :remote-addr :remote-user :method :url :status | param :req-param | body: :req-body | res: :res-body :response-time ms", {
        skip: function (req, res) {
            return req.originalUrl.startsWith("/api/ext/integration/hikvision")
        }
    })
)
ServiceRoutes.routesConfig(app)

app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body == "object" && "_method" in req.body) {
            var method = req.body._method
            delete req.body._method
            return method
        }
    })
)

let currentPort = parseInt(process.env.PORT || 3010)

const startServer = (port) => {
    currentPort = port
    server.listen(port, function () {
        var host = server.address().address
        var url = process.env.API_URL
        console.warn("SERVICE ON PORT ", host, url, port)
    })
}

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        const nextPort = currentPort + 1
        console.error(`PORT ${currentPort} is in use, retrying on ${nextPort}...`)
        setTimeout(() => startServer(nextPort), 300)
        return
    }

    console.error("SERVER ERROR ::", err.message)
})

startServer(currentPort)
