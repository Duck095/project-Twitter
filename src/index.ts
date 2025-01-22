import express, { Request, Response, NextFunction } from 'express' //import express vào dự án
import usersRoute from './routes/users.routes'   
import databaseService from './services/database.services'

const app = express() //dùng express tạo 1 server

app.use(express.json())

const PORT = 3000 //server sẽ chạy trên cổng port 3000

databaseService.connect()

app.get("/", (req, res) => {
  res.send("hello world");
})

app.use('/users', usersRoute)
// localhost:3000.users/tweets

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('error handler tổng nè');
  res.status(400).json({ message: err.message })
})


app.listen(PORT, () => {
  console.log(`Project này đang chạy trên post ${PORT}`);
})