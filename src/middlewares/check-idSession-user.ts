/* eslint-disable prettier/prettier */
import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkIdSessionUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { idSession } = request.cookies

  if(!idSession){
    return reply.status(401).send({message: 'User Unauthorized'})
  }
}
