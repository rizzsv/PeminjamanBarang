import  Express  from "express";
import UserRouter from "./User/user.router"
import ItemRouter from "./Barang/barang.router"

const app = Express();

app.use(Express.json());

app.use(`/user`, UserRouter)
app.use(`/item`, ItemRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})