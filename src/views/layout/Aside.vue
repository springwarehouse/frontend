<template>
  <div class="h-full overflow-x-hidden pt-2">
    <el-menu class="text-white !border-r-0" :router="true" :default-active="selectedIndex">
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Notification /></el-icon>
          <span class="text-base font-normal">模版-1</span>
        </template>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Notification, Switch, Warning } from '@element-plus/icons-vue'
import { listenerRouteChange } from '@/router'

const selectedIndex = ref(null)

listenerRouteChange((to) => {
  selectedIndex.value = to.path
}, true)
</script>
<style scoped></style>
