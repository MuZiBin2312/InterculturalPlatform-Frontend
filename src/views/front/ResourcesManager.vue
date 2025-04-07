vue
<template>
  <div class="manager-container">
    <!-- 头部（保持与管理后台一致） -->
    <div class="manager-header">
      <!-- ... 原有header代码保持不变 ... -->
    </div>

    <!-- 主体 -->
    <div class="manager-main">
      <!-- 资源侧边栏 -->
      <div class="manager-main-left">
        <el-menu
            router
            style="border: none"
            :default-active="$route.path"
            class="resources-menu"
        >
          <!-- 资源分类导航 -->
          <el-menu-item index="/resources/traditional-culture">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">传统文化</span>
          </el-menu-item>

          <el-menu-item index="/resources/festival-custom">
            <i class="el-icon-moon-night"></i>
            <span slot="title">节日习俗</span>
          </el-menu-item>

          <el-menu-item index="/resources/culture-lecture">
            <i class="el-icon-microphone"></i>
            <span slot="title">文化讲堂</span>
          </el-menu-item>

          <el-menu-item index="/resources/hotspot">
            <i class="el-icon-data-line"></i>
            <span slot="title">热点关注</span>
          </el-menu-item>

          <el-menu-item index="/resources/related-gallery">
            <i class="el-icon-picture"></i>
            <span slot="title">相关图志</span>
          </el-menu-item>

          <!-- 返回管理后台的入口 -->
          <el-menu-item index="/manager" class="back-to-manager">
            <i class="el-icon-back"></i>
            <span slot="title">返回管理后台</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 内容区域 -->
      <div class="manager-main-right">
        <router-view @update:user="updateUser" />
      </div>
    </div>
  </div>
</template>

<script>
// 保持与Manager组件相同的逻辑
export default {
  name: "ResourcesManager",
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
    }
  },
  created() {
    if (!this.user.id) {
      this.$router.push('/login')
    }
  },
  methods: {
    updateUser() {
      this.user = JSON.parse(localStorage.getItem('xm-user') || '{}')   // 重新获取下用户的最新信息
    },
    goToPerson() {
      if (this.user.role === 'ADMIN') {
        this.$router.push('/adminPerson')
      }
    },
    logout() {
      localStorage.removeItem('xm-user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import "@/assets/css/manager.css";
</style>

<!--<style scoped>-->
<!--/* 新增资源页面特定样式 */-->
<!--.resources-menu {-->
<!--  padding: 20px 0;-->
<!--}-->

<!--.resources-menu .el-menu-item {-->
<!--  height: 56px;-->
<!--  line-height: 56px;-->
<!--  font-size: 15px;-->
<!--  transition: all 0.3s;-->
<!--}-->

<!--.resources-menu .el-menu-item:hover {-->
<!--  background-color: #f0f9ff;-->
<!--  color: #409eff;-->
<!--}-->

<!--.back-to-manager {-->
<!--  margin-top: 30px;-->
<!--  border-top: 1px solid #eee;-->
<!--  color: #666;-->
<!--}-->
<!--</style>-->