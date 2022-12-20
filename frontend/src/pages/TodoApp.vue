<template>
  <div class="q-pa-md">
    <q-dialog v-model="showlogin">
      <q-card>
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="username" label="Username"/>
          <q-input v-model="password" label="Password" type="password"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Login" color="primary" @click="login" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-layout view="hHh Lpr lff" container style="height: 800px" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-black">
        <q-toolbar class="bg-red-14 text-black">
          <q-btn flat round dense icon="menu" class="q-mr-sm" @click="$router.push('/another/123')" />
            <q-avatar square>
              <img src="https://cdn1.iconfinder.com/data/icons/seo-and-web-set-1/100/Untitled-2-24-02-512.png" alt="clipboard">
            </q-avatar> 
            <q-toolbar-title>Batch 45: To Do List {{ task }}</q-toolbar-title>

            <q-btn v-if="user" dense icon="logout" label="logout" @click="wingsApp.logout()" />
            <q-btn v-else dense icon="login" label="login" @click="showlogin = true" />            
            <q-btn flat round dense icon="picture_as_pdf" @click="pdf('open')" />
            <q-btn flat round dense icon="print" @click="print" />
        </q-toolbar>

      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above

        :width="225"
        :breakpoint="500"
        bordered
        class="bg-white"
      >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item>
              <q-item-section avatar>
                <q-icon name="cake" />
              </q-item-section>

              <q-item-section>
                <me-human v-model="human.name" :human="human" @updateAge="(val) => human.age = val"/>
              </q-item-section>
            </q-item>

            <q-separator />

          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="avatar">
            </q-avatar>
            <div class="text-weight-bold">{{ human }}</div>
            <div>@juliuspaul</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>

        <pie-chart :donut="true" :data="[['Active', remaining], ['Completed', state.todos.length - remaining]]"></pie-chart>
    
    <!-- {{ human }} -->
    <!-- <me-human :human="human" @updateAge="(val) => human.age = val" /> -->

    <q-input class="q-ma-md" rounded outlined v-model="task" label="What needs to be done"
     @keyup.enter="add"
     ref="inputRef"
     @keyup.esc="inputRef.resetValidation()"
     :rules="[ val => val.length >= 3 || 'Please use minimum of 3 characters' ]"
    />
    <div class="q-py-md">
      <q-bar class="bg-red-14 text-black" outlined >
        <div>
          {{ remaining }} item/s left
        </div>

        <div>
          <!-- <div>Model: {{ toggleTask }} </div> -->
          <q-btn-toggle
          v-model="toggleTask"
          class="bg-white text-black"
          toggle-color="primary"
          padding="xs xl"
          :options="[
            {label: 'All', value: 'all'},
            {label: 'Active', value: 'active'},
            {label: 'Completed', value: 'completed'}
          ]"
          />
        </div>

      </q-bar>
    </div>
        <q-list bordered separator class="q-ma-md listPrint">
          <q-item @mouseover="hovering = todo.id" @mouseleave="hovering =-111" clickable v-ripple v-for="(todo, i ,done) in updateTask" :key="todo.id + 'item'">
          <!-- <q-item @mouseover="hovering = todo.id" @mouseleave="hovering =-111" clickable v-ripple v-for="(todo, i) in state.todos" :key="todo.id + 'item'" > -->
            <q-item-section avatar>
              <q-checkbox :modelValue="todo.done" @click="toggleStatus(todo)" @update:model-value="saveState" />
            </q-item-section>
              <q-item-section
                :class="{
                  strikethrough: todo.done
                  }"
              >
              <!-- <q-input v-if="editing === i" ref="edits" v-model="tempTask"
               @keyup.enter="editing = -1, todo.title = tempTask"
               @keyup.esc="editing = -1"
               @blur="editing = -1" />
                  <span v-else 
                    @dblclick="
                      editing = i,
                      tempTask = todo.title,
                      focusInput($refs)
                    "  
                    >
                    {{i}} {{todo.title}}
                  </span> -->
                  <span @click.stop @dblclick="$refs[todo.id][0].show()"> {{i}} {{todo.title}} </span>
                  <q-popup-edit @update:modelValue="(val) => updateTitle(val, todo)" :ref="todo.id" :modelValue="todo.title" class="bg-red-10 text-white" v-slot="scope">
                    <q-input dark color="white" v-model="scope.value" dense autofocus counter @keyup.enter="scope.set">
                      <template v-slot:append>
                        <q-icon name="edit" />
                      </template>
                    </q-input>
                  </q-popup-edit>

            </q-item-section>
            <q-item-section side>
              <q-btn :style="{
                display: hovering !== todo.id? 'none': ''
              }" icon="close" @click="removeTodo(todo.id)" round dense color="red" flat size="small" />
            </q-item-section>
        </q-item>
       </q-list>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>

import {computed, inject, reactive, ref } from 'vue'

import meHuman from 'src/components/meHuman.vue'

const showlogin = ref(false)

const username = ref('')
const password = ref('')

function login () {
  console.log(username.value)
  console.log(password.value)
  wingsApp.authenticate({
    email: username.value,
    password: password.value,
    strategy: 'local'
  })
}

const wingsApp = inject('wingsApp')

wingsApp.authenticate()

wingsApp.on('login', result => {
  console.log('logged in', result)
  user.value = result.user
  todosService.reset()
  todosService.init()
})

wingsApp.on('logout', result => {
  user.value = null
  state.todos = []
})

const todosService = inject('todosService')

const user = inject('user')

const hovering = ref(-123123)

todosService.on('dataChange', (todos) => {
  console.log(todos)
  state.todos = [...todos.map(t => ({...t, id: t._id }))]
})

function toggleStatus (todo) {
  todosService.patch(todo.id, {
    done: !todo.done
  })
}

const updateTitle = (title, todo) => {
  todosService.patch(todo.id, {
    title
  })
}

todosService.init()

const pdfMake = inject('pdfMake')
const printElement = inject('printElement')

const toggleTask = ref('all')

const print = () => {
  const el = document.querySelector('.listPrint')
  printElement(el)
}

function pdf (method) {
  const dd = {
    content: [
      {
        table: {
          body: [
            ['Status', 'Count'],
            ['active', remaining.value] ,
            ['completed', state.todos.length - remaining.value]
          ]
        }
      }
    ]
  }
  pdfMake.createPdf(dd)[method]()
}

 // create an array of todos

// async function focusInput (refs) {
//   await nextTick()
//   refs.edits[0].select()
//   // setTimeout(() => {
//   // }, 500)
//  }

 const human = ref({ name: 'Julius', age: 18})

 const task = ref('')

//  const tempTask = ref('')

 const inputRef = ref(null)

//  const editing = ref(-1)

 const state = reactive({
    todos: [
      // {
      //   id: 1,
      //   title: 'learn React',
      //   done: true,
      // },
      // {
      //   id: 2,
      //   title: 'learn Vue',
      //   done: true,
      // },
      // {
      //   id: 3,
      //   title: 'learn Vue 2',
      //   done: true,
      // }
    ]
  })

  const remaining = computed(() => {
    return state.todos.filter(todos => !todos.done).length
  })

  const updateTask = computed(() => {
    if(toggleTask.value === "active"){
      return state.todos.filter(todos => !todos.done)
    } else if (toggleTask.value === "completed"){
      return state.todos.filter(todos => todos.done)
    } else {
      return state.todos
    }
  })


  // state.todos = JSON.parse(window.localStorage.getItem('todos')) || [...state.todos]

  console.log(JSON.parse(window.localStorage.getItem('todos')))

  // state.todos = JSON.parse(window.localStorage.getItem('todos') || '[]')

 async function add () {
  // state.todos.unshift({
  //   id: Date.now(),
  //   title: task.value,
  //   done: false,
  // })

  await todosService.create({
    title: task.value,
    done: false
  })

  task.value = ''

  //window.localStorage.setItem('todos', JSON.stringify([...state.todos]))
  saveState()

  console.log(todos)
 }

 const saveState = () => window.localStorage.setItem('todos', JSON.stringify([...state.todos])) 

 const removeTodo = (id) => {

  todosService.remove(id)
  // for (let index = 0; index < state.todos.length; index++){
  //   const todo = state.todos[index]

  //   if (todo.id === id) {
  //     state.todos.splice(index, 1)
  //     saveState()
  //     return
  //   }
  // }

  // const index = state.todos.findIndex(todo => todo.id === id)
  // state.todos.splice(index,1)

 }

</script>

<style scoped>

  .hide {
    display: none
  }

  h3 {
    background-color: purple;
    color: white;
  }

  #header {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .bg-red {
    background-color: red;
  }

  .pinkcolor {
    color: pink;
  }

  .header {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  /* strikethrough */
  .strikethrough {
    text-decoration: line-through;
    color: gray;
  }
</style>