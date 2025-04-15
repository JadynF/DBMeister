const { Server } = require("socket.io");
const http = require("http");
const mysql = require('mysql2');
const { Connection, ConnectionConfig } = mysql;

// Define the connection configuration type
const connectionConfig = {
    host: "db-mysql-nyc3-22336-do-user-18048731-0.f.db.ondigitalocean.com",
    user: "doadmin",
    password: "AVNS_6To2mXLB6PyPqjZgeV6",
    database: "defaultdb",
    port: 25060 || 3306, // Default to 3306 if DB_PORT is not set
};

// Function to create a new connection to the database
const createConnection = () => {
    return mysql.createConnection(connectionConfig);
};

const server = http.createServer();

const io = new Server(server, {
  path: "/",
  cors: {
    origin: "*",
  },
  pingTimeout: 10000,
  pingInterval: 5000,
});

let diagramStates = {};
let diagramUsers = {};
diagramUsersMap = new Map();

let connectedUsers = {};
socketUsernameMap = new Map();

const getState = async (id) => {

  const connection = createConnection();
  let savedState = null;
  console.log(id);

  try {
      let response = await new Promise((resolve, reject) => {
          connection.query('SELECT state FROM diagrams WHERE id = ?', [id], (err, results) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });
      savedState = JSON.parse(response[0].state);
  }
  catch (error) {
      console.log(error);
  }
  finally {
      connection.end();
  }

  let maxID = 0;
  let returnState = {
    "nodes" : [{ id: "1", type: "BasicNode", position: { x: 250, y: -50 }, data: { header: "Welcome", color:  "#FFD700"} }],
    "edges" : [],
    "idCounter" : 2
  };
  if (savedState) {
    for (let i in savedState.nodes) { // get the maxID for the node index
        if (savedState.nodes[i].id > maxID) {
            maxID = savedState.nodes[i].id;
        }
    }

    returnState = {
      "nodes" : savedState.nodes,
      "edges" : savedState.edges,
      "idCounter" : maxID + 1
    }
  }

  return returnState;
}


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-diagram", async ({ diagramId, userData }) => {
    socket.join(diagramId);
    console.log(`User ${socket.id} joined diagram: ${diagramId}`);

    diagramUsersMap.set(socket.id, diagramId);
    socketUsernameMap.set(socket.id, userData);

    if (connectedUsers[diagramId] == undefined)
      connectedUsers[diagramId] = [userData];
    else
      connectedUsers[diagramId].push(userData);
    console.log("emitting receive-user-update");
    io.to(diagramId).emit("receive-user-update", connectedUsers[diagramId]);

    if (diagramUsers[diagramId] == undefined) 
      diagramUsers[diagramId] = 1;
    else
      diagramUsers[diagramId] += 1;

    if (diagramStates[diagramId] != undefined) {
      socket.emit("receive-state-update", diagramStates[diagramId]);
    }
    else {
      let newState = await getState(diagramId);
      diagramStates[diagramId] = newState;
      socket.emit("receive-state-update", newState);
    }
  });

  socket.on("send-state-update", ({ diagramId, data }) => {
    console.log("update received, emitting to all in " + diagramId);
    diagramStates[diagramId] = data;
    io.to(diagramId).emit("receive-state-update", data);
  });

  socket.on("send-node-update", ({ diagramId, data }) => {
    console.log("node update received, emitting to all in " + diagramId);

    console.log(data);
    console.log(diagramStates[diagramId]["nodes"]);

    const newNodes = diagramStates[diagramId]["nodes"].map(node => {
        if (node.id == data[0].id) {
          node.position = data[0].position;
        }
        return node;
      }
    )
    const newState = {"nodes": newNodes, "edges":diagramStates[diagramId]["edges"], "idCounter":diagramStates[diagramId]["idCounter"]};
    diagramStates[diagramId] = newState;
    io.to(diagramId).emit("receive-state-update", newState);
  });//

  socket.on("leave-room", (diagramId) => {
    console.log("leaving room: " + diagramId);
    diagramUsers[diagramId] -= 1;
    diagramUsersMap.delete(socket.id);

    connectedUsers[diagramId] = connectedUsers[diagramId].filter(item => item != socketUsernameMap.get(socket.id));
    io.to(diagramId).emit("receive-user-update", connectedUsers[diagramId]);
    socketUsernameMap.delete(socket.id);

    if (diagramUsers[diagramId] == 0) {
      console.log("deleting state");
      delete diagramStates[diagramId];
      delete connectedUsers[diagramId];
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const diagramId = diagramUsersMap.get(socket.id);
    if(diagramId) {
      diagramUsers[diagramId] -= 1;

      connectedUsers[diagramId] = connectedUsers[diagramId].filter(item => item != socketUsernameMap.get(socket.id));
      io.to(diagramId).emit("receive-user-update", connectedUsers[diagramId]);

      socketUsernameMap.delete(socket.id);

      if (diagramUsers[diagramId] == 0) {
        delete diagramStates[diagramId];
        delete connectedUsers[diagramId];
        console.log("deleting state");
      }
      diagramUsersMap.delete(socket.id);
    }
  });
});

server.listen(3030, () => {
  console.log("Socket.io server running on port 3030");
});
