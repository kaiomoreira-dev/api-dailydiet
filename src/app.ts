import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { snacksRoutes } from './routes/snack'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  credentials: true,
  allowedHeaders: 'Content-Type, *',
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
})

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'api/users',
})
app.register(snacksRoutes, {
  prefix: 'api/snacks',
})
