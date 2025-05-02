<template>
  <div style="background-color: #f8f8f8">
    <div>
      <iframe scrolling="no" src="https://widget.tianqiapi.com/?style=tg&skin=pitaya" frameborder="0" width="470" height="40" allowtransparency="true"></iframe>
    </div>
    <!--头部-->
    <div class="front-header">
      <div class="front-header-left">
        <img src="@/assets/imgs/logo_1.png" alt="">
        <div class="title">{{ $t('project.projectName') }}</div>
      </div>
      <div class="front-header-center">
        <div style="display: flex">
          <div class="menu" :class="{ 'menu-active' : $route.path.includes(item.path) }"
               v-for="item in menus" :key="item.path" @click="$router.push(item.path)">{{ $t(item.text) }}</div>
        </div>
      </div>
      <div style="width: 300px">
        <el-input v-model="title" prefix-icon="el-icon-search" size="medium" placeholder="请输入关键字搜索" style="width: 220px; margin-right: 5px"></el-input>
        <el-button size="medium" @click="search">{{ $t('button.search') }}</el-button>
      </div>
      <div class="front-header-right">
        <div v-if="!user.username">
          <el-button @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </div>
        <div v-else>
          <el-dropdown>
            <div class="front-header-dropdown">
              <img :src="user.avatar" alt="">
              <div style="margin-left: 10px">
                <span>{{ user.name }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>
                <div @click="$router.push('/front/userNews')">我的新闻</div>
              </el-dropdown-item> -->
              <el-dropdown-item>
                <div @click="$router.push('/front/userQuestion')">我的问题</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="$router.push('/front/userAnswer')">我的回答</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="$router.push('/front/userFeedback')">我的反馈</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="$router.push('/front/person')">个人信息</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="toggleLanguage">{{ $t('user.toggleLanguage') }}</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="logout">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主体区域：增加左右布局 -->
    <div class="main-container">
      <!-- 左侧全局菜单栏 -->
      <FrontSidebar />
    <!--主体-->
    <div class="main-body">
      <router-view ref="child" @update:user="updateUser" />
    </div>
  </div>

    <Footer />

  </div>

</template>

<script>
import Footer from "@/components/Footer";
import FrontSidebar from "@/components/FrontSidebar.vue";
export default {
  name: "FrontLayout",
  components: {
    Footer,
    FrontSidebar,
  },
  data () {
    return {
      top: '',
      notice: [],
      user: JSON.parse(localStorage.getItem("xm-user") || '{}'),
      menus: [
        { text: 'menu.home', path: '/front/home' },
        { text: 'menu.Q&A', path: '/front/question' },
        { text: 'menu.hotspots', path: '/front/localNews' },
        { text: 'menu.resources', path: '/front/resources' },
        { text: 'menu.videos', path: '/front/video' },
        { text: 'menu.feedback', path: '/front/feedback' },
        { text: 'menu.notice', path: '/front/notice' },
      ],
      title: this.$route.query.title
    }
  },
  mounted() {

  },
  methods: {
    search() {
      location.href = '/front/search?title=' + this.title
    },
    updateUser() {
      this.user = JSON.parse(localStorage.getItem('xm-user') || '{}')   // 重新获取下用户的最新信息
    },
    // 退出登录
    logout() {
      localStorage.removeItem("xm-user");
      this.$router.push("/login");
    },
    // 语言切换方法
    toggleLanguage() {
      const currentLocale = this.$i18n.locale;
      this.$i18n.locale = currentLocale === 'zh' ? 'en' : 'zh';
      // 可选：记住用户选择，下次打开直接用
      localStorage.setItem('locale', this.$i18n.locale);
    }
  }

}
</script>

<style scoped>
  @import "@/assets/css/front.css";

  .menu {
    padding: 0 20px;
    color: #0551b6;
    cursor: pointer;
    font-size: 16px;
  }
  .menu:hover:not(.menu-active) {
    color: #6BABFF;
  }
  .menu-active {
    color: #fff;
    background-color: #2a60c9;
  }
</style>