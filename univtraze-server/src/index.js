require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const userRouter = require("./api/users/user.router");
const adminRouter = require("./api/admins/admin.router");
const vaccination_info = require("./api/vaccination_info/vaccination.router");
const roomRouter = require("./api/rooms/room.router");
const covidCasesRouter = require("./api/covid_cases/covid_case.router");
const clinicRouter = require("./api/clinic/clinicAdmin.router");
const mailerRouter = require("./api/mailer/mailer.router")
const communicable_disease = require('./api/communicable_disease/communicable_disease.router')
const victimsRouter = require('./api/victims/victims.router')
const notificationsRouter = require('./api/notifications/notifications.router')

const bodyParser = require('body-parser');
const cors = require("cors");


app.use(cors({origin: "*"}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/vaccine_info", vaccination_info);
app.use("/api/rooms", roomRouter);
app.use("/api/covid_cases", covidCasesRouter);
app.use("/api/clinic", clinicRouter);
app.use("/api/communicable_disease", communicable_disease)
app.use("/api/mailer", mailerRouter)
app.use("/api/victims", victimsRouter)
app.use("/api/notifications", notificationsRouter)

app.get('/', (req, res) => {
  res.send("Welcome to univtraze server!!");
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(process.env.PORT || 3001, () => {
  console.clear()
  console.log('listening on:', process.env.PORT);
});