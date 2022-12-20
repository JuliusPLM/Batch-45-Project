import { boot } from 'quasar/wrappers'
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'

import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js'

import printElement from 'ink-html'

import wings from 'wings4'
import { ref } from 'vue'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  // something to do

  app.use(VueChartkick)

  // const pdfFonts = await import('pdfmake/build/vfs_fonts.js')
  console.log('pdfFonts', pdfFonts)
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  app.provide('pdfMake', pdfMake)

  const wingsApp = wings('http://localhost:3030')
  app.provide('wingsApp', wingsApp)

  app.provide('todosService', wingsApp.wingsService('tasks'))

  app.provide('printElement', printElement)

  app.provide('user', ref(null))
})
