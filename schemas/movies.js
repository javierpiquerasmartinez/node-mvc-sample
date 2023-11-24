import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url().optional(),
  genre: z.array(
    z.enum(['Action', 'Crime', 'Adventure', 'Drama', 'Comedy'])
  )
})

export function validateMovie (input) {
  return movieSchema.safeParse(input)
}

export function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}
