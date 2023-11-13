const express = require("express");
require("./lib/mongoose");
const cors = require("cors");
const {
  ValidRes,
  ErrNotAuth,
  ErrNotAuthed,
  CreatedRes,
  ErrUserNotFound,
} = require("./lib/ResponseHandler");
const { jwtVerify } = require("./lib/JWT");
const { getUserById } = require("./services/users.service");
const { getPermissionsList } = require("./lib/permissions");

const app = express();

app.use(cors())

// auth layer
// app.use(
//   cors({
//     origin: "http://localhost:3000/",

//   })
// );

const port = process.env.PORT || 4000;

// preparation layer

//receive body as json
app.use(express.json());

app.use((req, res, next) => {
  res.ok = (data) => {
    const resp = ValidRes(data);

    res.block(resp);
  };

  res.create = (data) => {
    const resp = CreatedRes(data);
    res.block(resp);
  };

  res.block = (resp) => {
    res.status(resp.status).send(resp.payload);
  };

  next();
});

const path = require("path");
const { upload } = require("./storage/storage"); // Update the path accordingly
const { isAdmin } = require("./lib/permissions");

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handle file upload (with authorization check)
app.post("/upload/pet", isAdmin, upload.single("image"), (req, res) => {
  res.send(req.fileName);
});

//auth middleware
app.use(async (req, res, next) => {
  const authorized = ["/users/login", "/users/signup"];

  if (authorized.includes(req.url)) {
    return next();
  }

  const { authorization } = req.headers;

  // search when the user not logged it
  if (req.url.includes("/pets") && req.method === "GET" && !authorization) {
    return next();
  }

  try {
    const decoded = jwtVerify(authorization);

    const user = await getUserById(decoded.id);

    if (!user) {
      return next(ErrUserNotFound());
    }

    delete user.password;

    user.permissions = getPermissionsList(user.permissionId);

    req.user = user;

    return next();
  } catch (error) {
    next(ErrNotAuthed());
  }
});

// route layer
app.use("/users", require("./routes/users.route"));
app.use("/pets", require("./routes/pets.route"));
app.use("/upload", require("./routes/upload.route"));

// for cors error

const petsRoute = require("./routes/pets.route");
const usersRoute = require("./routes/users.route");
const uploadRoute = require("./routes/upload.route");

app.use("/users", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}, usersRoute);

app.use("/pets", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}, petsRoute);

app.use("/upload", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}, uploadRoute);

// error layer
app.use((err, req, res, next) => {
  console.log("err ->>> ", err);
  res.block(err);
});

app.listen(port, () => {
  console.log("Express is listening on port " + port);
});
