import { Router } from 'express'
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from '../cabinet/controllers/course.controller'
import {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessons,
  getLessonsById,
  updateLesson,
} from '../cabinet/controllers/lesson.controller'
import { createTag, deleteTag, getTags, updateTag } from '../cabinet/controllers/tag.controller'
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from '../cabinet/controllers/skill.controller'
import {
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  getFeedbacks,
  updateFeedback,
} from '../cabinet/controllers/feedback.controller'
import { createChat, getChats, updateChat } from '../cabinet/controllers/chat.controller'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  router.post('/course', createCourse)
  router.get('/courses', getCourses)
  router.get('/course/:id', getCourseById)
  router.put('/course', updateCourse)
  router.delete('/course', deleteCourse)

  router.post('/lesson', createLesson)
  router.get('/lessons', getLessons)
  router.get('/lessons-by-id/', getLessonsById)
  router.get('/lesson/:id', getLessonById)
  router.put('/lesson', updateLesson)
  router.delete('/lesson', deleteLesson)

  router.post('/tag', createTag)
  router.get('/tags', getTags)
  router.put('/tag', updateTag)
  router.delete('/tag', deleteTag)

  router.post('/skill', createSkill)
  router.get('/skills', getSkills)
  router.put('/skill', updateSkill)
  router.delete('/skill', deleteSkill)

  router.post('/feedback', createFeedback)
  router.get('/feedbacks', getFeedbacks)
  router.get('/feedback/:id', getFeedbackById)
  router.put('/feedback', updateFeedback)
  router.delete('/feedback', deleteFeedback)

  router.post('/chat', createChat)
  router.get('/chats', getChats)
  router.put('/chat', updateChat)

  return router
}
