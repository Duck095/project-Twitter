import express, { Request, Response, NextFunction } from 'express' //import express vào dự án
import usersRoute from './routes/users.routes'   
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express() //dùng express tạo 1 server

app.use(express.json())

const PORT = 3000 //server sẽ chạy trên cổng port 3000

databaseService.connect()

app.get("/", (req, res) => {
  res.send("hello world");
})

app.use('/users', usersRoute)
// localhost:3000.users/tweets

app.use(defaultErrorHandler)


app.listen(PORT, () => {
  console.log(`Project này đang chạy trên post ${PORT}`);
})