import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { snacksRoutes } from './routes/snack'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  credentials: true,
  origin: 'https://domain1.com',
  methods: 'GET, POST, PUT, PATCH, DELETE',
  allowedHeaders: 'Content-Type, *',
})

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'api/users',
})
app.register(snacksRoutes, {
  prefix: 'api/snacks',
})
