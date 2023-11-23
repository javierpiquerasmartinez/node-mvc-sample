import { Router } from 'express'
import { readJSON } from '../utils/json.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { randomUUID } from 'crypto'

export const moviesRouter = Router()

const movies = readJSON('movies.json')

moviesRouter.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).send(result.error.message)
  }
  const newMovie = {
    id: randomUUID(),
    ...result.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  else res.status(404).send('<h1>Resource not found</h4>')
})

moviesRouter.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).send(result.error.message)
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex < 0) return res.status(404).send('Resource not found')
  const movieUpdated = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = movieUpdated
  res.json(movieUpdated)
})

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex < 0) return res.status(404).send('Resource not found')

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})
