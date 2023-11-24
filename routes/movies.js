import { Router } from 'express'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from '../models/movie.js'

export const moviesRouter = Router()

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query
  const movies = await MovieModel.getAll({ genre })
  res.json(movies)
})

moviesRouter.post('/', async (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).send(result.error.message)
  }
  const newMovie = await MovieModel.create(result)
  res.status(201).json(newMovie)
})

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const movie = await MovieModel.getById(id)
  if (movie) return res.json(movie)
  else res.status(404).send('<h1>Resource not found</h4>')
})

moviesRouter.patch('/:id', async (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).send(result.error.message)
  }
  const { id } = req.params
  const movieUpdated = await MovieModel.update({ id, input: result.data })
  if (!movieUpdated) return res.status(404).json({ error: 'Movie not found' })
  res.json(movieUpdated)
})

moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  const wasDeleted = await MovieModel.delete({ id })
  if (!wasDeleted) return res.status(404).json({ error: 'Movie not found' })
  res.json({ message: 'Movie deleted' })
})
