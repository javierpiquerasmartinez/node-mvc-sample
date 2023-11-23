import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.disable('x-powered-by')

app.use(json())
app.use(corsMiddleware())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World'
  })
})

app.use('/movies', moviesRouter)

const PORT = process.env.port ?? 3000

app.listen(PORT, () => {
  console.info(`Server listening on port http://localhost:${PORT}`)
})
