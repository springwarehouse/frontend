<template>
  <el-container class="h-screen">
    <el-header class="border-b-[1px] border-gray-200">
      <NavBar></NavBar>
    </el-header>
    <el-container class="h-[calc(100vh-60px)]">
      <el-aside
        width="220px"
        class="h-full z-10"
        style="box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08)"
      >
        <Aside></Aside>
      </el-aside>
      <el-main class="h-full bg-gray-100">
        <Main></Main>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import Aside from './Aside.vue'
import Main from './Main.vue'
import NavBar from './NavBar.vue'
import { ElNotification } from 'element-plus'

import { useWsWarning } from '@/stores/wsStore'

useWsWarning((data) => {
  const { name1, name2 } = data
  const msg = `${name1} ${name2} 发生告警`
  ElNotification({
    title: '告警',
    message: msg,
    type: 'warning'
  })
})
</script>
