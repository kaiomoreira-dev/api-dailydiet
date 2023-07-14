import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { snacksRoutes } from './routes/snack'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'api/users',
})
app.register(snacksRoutes, {
  prefix: 'api/snacks',
})
