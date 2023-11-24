import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) {
      return res.status(400).send(result.error.message)
    }
    const newMovie = await this.movieModel.create(result.data)
    res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).send(result.error.message)
    }
    const { id } = req.params
    const movieUpdated = await this.movieModel.update({ id, input: result.data })
    if (!movieUpdated) return res.status(404).json({ error: 'Movie not found' })
    res.json(movieUpdated)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const wasDeleted = await this.movieModel.delete({ id })
    if (!wasDeleted) return res.status(404).json({ error: 'Movie not found' })
    res.json({ message: 'Movie deleted' })
  }

  getById = async (req, res) => {
    const { id } = req.params
    console.log(id)
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.json(movie)
    else res.status(404).send('<h1>Resource not found</h4>')
  }
}
