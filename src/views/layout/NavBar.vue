<template>
  <div class="flex justify-between h-full">
    <div class="flex items-center pl-3">
      <el-space>
        <img class="h-[48px]" alt="logo" :src="logo" />
        <h5 class="text-lg font-medium">Vite App</h5>
      </el-space>
    </div>
    <div class="flex-1"></div>
    <div class="flex pr-4 items-center">
      <div class="px-4">
        <el-tooltip content="消息通知">
          <el-badge is-dot>
            <el-button :icon="Bell" circle class="icon-button"> </el-button>
          </el-badge>
        </el-tooltip>
      </div>
      <div class="px-4">
        <el-dropdown>
          <el-avatar :icon="UserFilled" :size="32" style="outline: none" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script setup>
import { UserFilled, Bell } from '@element-plus/icons-vue'
import logo from '@/assets/logo.svg'

function logOut() {}
</script>
<style scoped>
.icon-button {
  border-width: 0px;
  font-size: 16px;
}
</style>
