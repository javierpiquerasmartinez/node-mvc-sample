import { MovieModel } from '../models/local-fs/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async create (req, res) {
    const result = validateMovie(req.body)
    if (result.error) {
      return res.status(400).send(result.error.message)
    }
    const newMovie = await MovieModel.create(result)
    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).send(result.error.message)
    }
    const { id } = req.params
    const movieUpdated = await MovieModel.update({ id, input: result.data })
    if (!movieUpdated) return res.status(404).json({ error: 'Movie not found' })
    res.json(movieUpdated)
  }

  static async delete (req, res) {
    const { id } = req.params
    const wasDeleted = await MovieModel.delete({ id })
    if (!wasDeleted) return res.status(404).json({ error: 'Movie not found' })
    res.json({ message: 'Movie deleted' })
  }

  static async getById (req, res) {
    const { id } = req.params
    console.log(id)
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    else res.status(404).send('<h1>Resource not found</h4>')
  }
}
