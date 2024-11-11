import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'
import { CREATED, DELETED, UPDATED } from '../../../middleware/error.middleware'

export async function createFeedback(req, res: Response) {
  const { userId, lessonId, rating, feedbackName } = req.query

  try {
    const newItem = await db('feedbacks')
      .insert({ user_id: userId, lesson_id: lessonId, rating, feedback_name: feedbackName })
      .returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED, skillId: newItem[0].id })
  } catch (error) {
    console.error('Error in feedback.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getFeedbacks(req: Request, res: Response) {
  try {
    const getFeedbacks = await db.select('*').from('feedbacks')

    return res.status(200).json({ getFeedbacks })
  } catch (error) {
    console.error('Error in feedback.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function getFeedbackById(req: Request, res: Response) {
  const { userId, lessonId } = req.query
  try {
    const getFeedbackById = await db
      .select('*')
      .from('feedbacks')
      .where({ user_id: userId, lesson_id: lessonId })

    return res.status(200).json({ getFeedbackById })
  } catch (error) {
    console.error('Error in feedback.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateFeedback(req: Request, res: Response) {
  const { id, userId, lessonId, rating, feedbackName } = req.query

  try {
    await db
      .table('feedbacks')
      .update({ user_id: userId, lesson_id: lessonId, rating, feedback_name: feedbackName })
      .where('id', id)

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in feedback.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function deleteFeedback(req: Request, res: Response) {
  const { id } = req.query

  try {
    await db('feedbacks').where({ id }).del()

    return res.status(200).json({ message: DELETED })
  } catch (error) {
    console.error('Error in feedback.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
