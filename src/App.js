const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

function replacer(key, value) {
  if (value instanceof Map) {
      const reducer = (obj, mapKey) => {
          obj[mapKey] = value.get(mapKey);
          return obj;
      };
      return [...value.keys()].sort().reduce(reducer, {});
  } else if (value instanceof Set) {
      return [...value].sort();
  }
  return value;
}

const randomString = (i) => {
  let rnd = '';
  while (rnd.length < i) 
      rnd += Math.random().toString(36).substring(2);
  return rnd.substring(0, i);
};

const cors = require('cors');

const PORT = process.env.PORT || 9999;

const rooms = new Map();
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('HELLO');
});

app.post('/createGame', (req, res) => {
  const { firstName, lastName, jobPosition, image } = req.body;
  const id = randomString(5);

  rooms.set(
    id,
    new Map([
      ['users', []],
      ['admin', new Map([
        ['firstName', firstName],
        ['lastName', lastName],
        ['jobPosition', jobPosition],
        ['image', image],
    ])],
    ])
  );
  const room = JSON.stringify(rooms.get(id).set('roomId', id), replacer, 2)
  res.send(room);
});

app.post('/connectGame', (req, res) => {
  const { roomId, firstName, lastName, jobPosition, image, rule } = req.body;
  // if (rooms.has(roomId)) {
    console.log("🚀 ~ file: app.js ~ line 109 ~ app.post ~ rooms", rooms)
    const id = randomString(7);
    const obj = {
      id,
      firstName,
      lastName,
      jobPosition,
      image
    }
    // rooms.get(roomId).get('users').set(
    //   id,
    //   new Map([
    //     ['firstName', firstName],
    //     ['lastName', lastName],
    //     ['jobPosition', jobPosition],
    //     ['image', image],
    // ])
    // );
        rooms.get(roomId).get('users').push(obj)
        console.log("🚀 ~ file: app.js ~ line 109 ~ app.post ~ rooms", rooms)
    
    // rooms.set(
    //   roomId,
    //   new Map([
    //     ['users', new Map()],
    //     ['admin', userName]
    //   ]),
    // );
  // }
  console.log(rooms)
  res.send();
});

// app.post('/rooms', (req, res) => {
//   const { roomId, userName } = req.body;
//   if (!rooms.has(roomId)) {
//     rooms.set(
//       roomId,
//       new Map([
//         ['users', new Map()],
//         ['admin', userName]
//       ]),
//     );
//   }
//   res.send();
// });

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    io.sockets.in(roomId).emit('ROOM:SET_USERS', users);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).emit('ROOM:SET_USERS', users);
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