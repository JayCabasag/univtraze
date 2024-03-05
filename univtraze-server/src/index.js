require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use('/api/temperature-history', require('./api/temperature_history/temp_history.router'));
app.use('/api/users', require('./api/users/user.router'));
app.use('/api/admins', require('./api/admins/admin.router'));
app.use('/api/vaccination-records', require('./api/vaccination_records/vaccination_records.router'));
app.use('/api/rooms', require('./api/rooms/room.router'));
app.use('/api/covid_cases', require('./api/covid_cases/covid_case.router'));
app.use('/api/clinic', require('./api/clinic/clinicAdmin.router'));
app.use('/api/communicable_disease', require('./api/communicable_disease/communicable_disease.router'));
app.use('/api/disease-cases', require('./api/disease_cases/disease_cases.router'));
app.use('/api/mailer', require('./api/mailer/mailer.router'));
app.use('/api/victims', require('./api/victims/victims.router'));
app.use('/api/notifications', require('./api/notifications/notifications.router'));
app.use('/api/room-visited', require('./api/room-visited/room_visited.router'));
app.use('/api/emergency-reports', require('./api/emergency-reports/emergency_reports.routes'));
app.use('/api/kiosk', require('./api/kiosk/kiosk.router'));
app.use('/api/account-recovery', require('./api/account_recovery/account_recovery.router'));

app.get('/', (req, res) => {
  res.send('Welcome to univtraze server!!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(process.env.PORT || 3001, () => {
  console.clear();
  console.log('listening on:', process.env.PORT);
});
