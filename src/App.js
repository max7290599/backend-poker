const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const replacer = require('./utils/replacer');
const randomString = require('./utils/randomString');
const staticImage = require('../public/assets/avatar');

const PORT = process.env.PORT || 9999;

const rooms = new Map();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('HELLO');
});

app.post('/createGame', (req, res) => {
  const { firstName, secondName, jobPosition, image=staticImage } = req.body;
  const id = randomString(i);
  rooms.set(
    id,
    new Map([
      ['users', new Map()],
      ['admin',
        new Map([
          ['firstName', firstName],
          ['secondName', secondName],
          ['jobPosition', jobPosition],
          ['image', image],
        ]),
      ],
    ]),
  );
  const room = JSON.stringify(rooms.get(id).set('roomId', id), replacer, 2);
  res.send(room);
});

app.post('/connectGame', (req, res) => {
  const { roomId } = req.body;
  if (rooms.has(roomId)) {
    res.status(200).send('Ok');
  } else {
    res.status(406).send('This game does not exist');
  }
});

io.on('connection', (socket) => {
  socket.on('GAME:JOIN', ({ 
    roomId, firstName, secondName, jobPosition, image=staticImage, role="admin" 
  }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(
        socket.id,
        new Map([
          ['firstName', firstName],
          ['secondName', secondName],
          ['jobPosition', jobPosition],
          ['image', image],
          ['role', role],
        ]),
      );
    const users = [...rooms.get(roomId).get('users').values()];
    const parseUsers = JSON.stringify(users, replacer, 2);
    io.sockets.in(roomId).emit('GAME:SET_USERS', parseUsers);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
    
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        const parseUsers = JSON.stringify(users, replacer, 2);
        socket.to(roomId).emit('GAME:SET_USERS', parseUsers);
      }
    });
  });

  console.log('user connected', socket.id);
});

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});
