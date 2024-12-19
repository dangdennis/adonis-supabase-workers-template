/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const SampleController = () => import('#controllers/sample_controller')

router.on('/').renderInertia('home')
router.get('/sample', [SampleController, 'index'])
router
  .group(() => {
    router.get('/protected-sample', [SampleController, 'protectedIndex'])
  })
  .use(middleware.auth())
