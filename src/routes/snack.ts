import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../connectionDB'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkIdSessionUser } from '../middlewares/check-idSession-user'

export async function snacksRoutes(app: FastifyInstance) {
  // Create a Snack
  app.post(
    '/',
    { preHandler: [checkIdSessionUser] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const snackSchema = z.object({
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        date: z.string().nonempty(),
        time: z.string().nonempty(),
        isDiet: z.boolean(),
      })

      const { name, description, date, time, isDiet } = snackSchema.parse(
        request.body,
      )

      const dateFormmat = new Date(Date.parse(`${date}`))
      const dateHoursString = new Date(`${date}T${time}.000Z`)

      console.log(dateHoursString)

      const idSession = request.cookies.idSession

      if (!idSession) {
        return reply.status(401).send({ error: 'User Unauthorized!' })
      }

      const user = await knex('users')
        .where({
          idSession,
        })
        .select()
        .first()

      if (!user) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      // fluxo alternativo zera sequencia
      if (!isDiet) {
        const snack = await knex('snacks')
          .insert({
            id: randomUUID(),
            name,
            idUser: user.id,
            description,
            date,
            time,
            isDiet,
          })
          .returning('*')
        await knex('users')
          .where({ idSession })
          .update({
            inSequency: 0,
          })
          .returning('*')

        return reply.status(201).send({ snack })
      }

      // fluxo principal incrementar sequency dentro da dieta
      const snack = await knex('snacks')
        .insert({
          id: randomUUID(),
          name,
          idUser: user.id,
          description,
          date: dateFormmat,
          time: dateHoursString,
          isDiet,
        })
        .returning('*')

      const [userUpdated] = await knex('users')
        .where({ idSession })
        .update({
          inSequency: user.inSequency + 1,
        })
        .returning('*')

      if (!userUpdated) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      if (userUpdated.inSequency >= userUpdated.bestSequency) {
        await knex('users')
          .where({ idSession })
          .update({
            bestSequency: userUpdated.inSequency,
          })
          .returning('*')
        return reply.status(201).send({ snack })
      }
      return reply.status(201).send({ snack })
    },
  )
  // Update a Snack by id for a user
  app.put(
    '/',
    { preHandler: [checkIdSessionUser] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const snackSchema = z.object({
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        date: z.string().nonempty(),
        time: z.string().nonempty(),
        isDiet: z.boolean(),
      })

      const { name, description, date, time, isDiet } = snackSchema.parse(
        request.body,
      )

      const idSession = request.cookies.idSession

      const getUser = await knex('users')
        .where({
          idSession,
        })
        .select()
        .first()

      if (!getUser) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      const [snack] = await knex('snacks')
        .where({
          idUser: getUser.id,
        })
        .update({
          name,
          description,
          date,
          time,
          isDiet,
        })
        .returning('*')

      return reply.status(200).send({ snack })
    },
  )
  // List all Snack for a user
  app.get(
    '/',
    {
      preHandler: [checkIdSessionUser],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { idSession } = request.cookies

      const getUser = await knex('users')
        .where({
          idSession,
        })
        .select()
        .first()

      if (!getUser) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      const snacks = await knex('snacks')
        .where({
          idUser: getUser.id,
        })
        .select()
        .returning('*')

      return reply.status(200).send({ snacks })
    },
  )
  // Get a Snack by id for a user
  app.get(
    '/:id',
    {
      preHandler: [checkIdSessionUser],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { idSession } = request.cookies

      const getUser = await knex('users')
        .where({
          idSession,
        })
        .select()
        .first()

      if (!getUser) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      const idSnackParams = z.object({
        id: z.string().uuid().nonempty(),
      })

      const { id } = idSnackParams.parse(request.params)

      const snack = await knex('snacks')
        .where({
          id,
        })
        .select()
        .returning('*')
        .first()

      return reply.status(200).send(snack)
    },
  )
  // Delete a Snack by id for a user
  app.delete(
    '/:id',
    {
      preHandler: [checkIdSessionUser],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { idSession } = request.cookies

      const getUser = await knex('users')
        .where({
          idSession,
        })
        .select()
        .first()

      if (!getUser) {
        return reply.status(404).send({ error: 'User not found!' })
      }

      const idSnackParams = z.object({
        id: z.string().uuid().nonempty(),
      })

      const { id } = idSnackParams.parse(request.params)

      const snack = await knex('snacks')
        .where({
          id,
        })
        .select()
        .returning('*')
        .first()

      if (!snack) {
        return reply.status(404).send({ error: 'Snack not found!' })
      }

      const deleteSnack = await knex('snacks').where({ id }).delete()

      return reply.status(200).send({ deleteSnack })
    },
  )
}
