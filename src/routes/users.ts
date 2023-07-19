import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../connectionDB'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkIdSessionUser } from '../middlewares/check-idSession-user'

export async function usersRoutes(app: FastifyInstance) {
  // Creat a User
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const userSchema = z.object({
      name: z.string().nonempty(),
      email: z.string().nonempty(),
    })

    const { name, email } = userSchema.parse(request.body)

    let idSession = request.cookies.idSession

    if (idSession) {
      const [users] = await knex('users')
        .where({
          idSession,
        })
        .select()
        .returning('*')

      if (users.email !== email) {
        idSession = randomUUID()

        const [users] = await knex('users')
          .insert({
            id: randomUUID(),
            name,
            email,
            idSession,
          })
          .returning('*')

        return reply
          .setCookie('idSession', idSession, {
            path: '/',
            httpOnly: true,
            secure: true,
            domain: 'localhost',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
          })
          .status(201)
          .send(users)
      }

      return reply.status(200).send({ users })
    }

    if (!idSession) {
      idSession = randomUUID()
    }

    const [users] = await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,
        idSession,
      })
      .returning('*')

    return reply
      .setCookie('idSession', idSession, {
        path: '/',
        httpOnly: true,
        secure: true,
        domain: 'localhost',
      })
      .status(201)
      .send(users)
  })
  // Get a User by id
  app.get(
    '/:id',
    {
      preHandler: [checkIdSessionUser],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { idSession } = request.cookies

      const idUserParams = z.object({
        id: z.string().uuid().nonempty(),
      })

      const { id } = idUserParams.parse(request.params)

      const users = await knex('users')
        .where({
          id,
          idSession,
        })
        .select()
        .first()

      if (!users) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      return reply.status(200).send({ users })
    },
  )
  // Get a metrics fo User by id
  app.get(
    '/metrics/:id',
    {
      preHandler: [checkIdSessionUser],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { idSession } = request.cookies

      const idUserParams = z.object({
        id: z.string().uuid().nonempty(),
      })

      const { id } = idUserParams.parse(request.params)

      const users = await knex('users')
        .where({
          id,
          idSession,
        })
        .select()
        .first()

      if (!users) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      const totalCreatedSnacks = await knex('snacks')
        .where({ idUser: users.id })
        .count('idUser', { as: 'totalSnacks' })
        .select()
        .first()

      if (!totalCreatedSnacks) {
        return reply
          .status(400)
          .send({ error: 'Error while calculating metrics ' })
      }

      const { totalSnacks } = totalCreatedSnacks

      const totalCreatedSnacksInDiet = await knex('snacks')
        .where({ idUser: users.id, isDiet: true })
        .count('idUser', { as: 'snacksInDiet' })
        .select()
        .first()

      if (!totalCreatedSnacksInDiet) {
        return reply
          .status(400)
          .send({ error: 'Error while calculating metrics ' })
      }

      const { snacksInDiet } = totalCreatedSnacksInDiet

      const totalCreatedSnacksOutDiet = await knex('snacks')
        .where({ idUser: users.id, isDiet: false })
        .count('idUser', { as: 'snacksOutDiet' })
        .select()
        .first()

      if (!totalCreatedSnacksOutDiet) {
        return reply
          .status(400)
          .send({ error: 'Error while calculating metrics ' })
      }

      const { snacksOutDiet } = totalCreatedSnacksOutDiet

      const metrics = {
        totalSnacks: Number(totalSnacks),
        snacksInDiet: Number(snacksInDiet),
        snacksOutDiet: Number(snacksOutDiet),
        bestSequencyInDiet: users.bestSequency,
      }

      return reply.status(200).send({ metrics })
    },
  )
}
