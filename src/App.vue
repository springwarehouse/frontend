<template>
  <el-config-provider :locale="zhCN">
    <RouterView />
  </el-config-provider>
</template>
<script setup>
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style scoped></style>
