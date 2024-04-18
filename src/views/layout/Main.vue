<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in menuList" :key="item.name">{{
      item.name
    }}</el-breadcrumb-item>
  </el-breadcrumb>
  <router-view v-slot="{ Component }" class="mt-4">
    <keep-alive>
      <component :key="$route.name" :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :key="$route.name" :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>
<script setup>
import { onMounted, computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuList = computed(() => {
  return route.matched.filter((v) => v.name != 'home').map((v) => ({ name: v.meta.title }))
})
onMounted(() => {})
</script>
