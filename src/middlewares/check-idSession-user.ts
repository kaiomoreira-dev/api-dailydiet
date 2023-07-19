/* eslint-disable prettier/prettier */
import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkIdSessionUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { idSession } = request.cookies

  console.log(idSession)

  if(!idSession){
    return reply.status(404).send({message: 'Cookie not found'})
  }
}
