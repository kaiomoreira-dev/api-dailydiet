import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { snacksRoutes } from './routes/snack'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  credentials: true,
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  allowedHeaders: '*',
  exposedHeaders: '*',
})

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'api/users',
})
app.register(snacksRoutes, {
  prefix: 'api/snacks',
})
