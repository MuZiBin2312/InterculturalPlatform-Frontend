<template>
  <div style="background-color: #fff">

    <!--头部-->
    <div class="front-header">
      <div class="front-header-left">
        <img src="@/assets/imgs/logo_1.png" alt="">
        <div class="title">{{ $t('project.projectName') }}</div>
      </div>
      <div class="front-header-center">
        <div class="weather-wrapper">
          <iframe
              scrolling="no"
              src="https://widget.tianqiapi.com/?style=tg&skin=pitaya"
              frameborder="0"
              width="470"
              height="40"
              allowtransparency="true"
          ></iframe>
        </div>
      </div>

      <div style="display: flex; align-items: center">
        <div style="width: 300px;">
          <el-input
              v-model="title"
              prefix-icon="el-icon-search"
              size="medium"
              :placeholder="$t('text.searchBar')"
              style="width: 220px; margin-right: 5px"
          ></el-input>
          <el-button size="medium" @click="search">{{ $t('button.search') }}</el-button>
        </div>

        <!-- 地球图标 + 语言选择器 -->
        <div style="display: flex; align-items: center; margin-left: 10px;
">
<!--          <img src="@/assets/imgs/语言.png" alt="语言图标" style="width: 20px; height: 20px; margin-right: 5px;" />-->

          <el-select
              v-model="currentLocale"
              size="medium"
              @change="changeLanguage"
              style="width: 120px"
          >
            <template #prefix>
              <img
                  src="@/assets/imgs/语言.png"
                  alt="语言"
                  style="width: 20px; height: 20px; margin-left: 0px;vertical-align: middle;"
              />
            </template>

            <el-option
                v-for="item in languageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
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
              <el-dropdown-item v-if="user.role != 'TEACHER'">
                <div @click="$router.push('/front/userQuestion')">{{ $t('user.myQuestion') }}</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="$router.push('/front/userAnswer')">{{ $t('user.myAnswer') }}</div>
              </el-dropdown-item>

              <el-dropdown-item>
                <div @click="$router.push('/front/userFeedback')">{{ $t('user.myFeedback') }}</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goToSelfEvaluation" v-if="this.user.role === 'USER'">{{ $t('user.self-assessment') }}</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="$router.push('/front/person')">{{ $t('user.profile') }}</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="logout">{{ $t('user.logout') }}</div>
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
      languageOptions: [
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' }
      ],
      currentLocale: localStorage.getItem('locale') || 'zh',
      title: this.$route.query.title
    }
  },
  mounted() {

  },
  methods: {
    goToSelfEvaluation() {
      this.$request.get('/notice/selectPage').then(res => {
        const list = res.data.list || []
        // 过滤出 category 为 3 的问卷并按时间排序（假设有 time 字段）
        const selfEvalList = list.filter(item => item.category === 3)
        if (selfEvalList.length > 0) {
          // 取最新一条（假设列表已经按时间倒序排好，或者你手动排一下）
          const latest = selfEvalList[0]
          if (latest.content) {
            window.open(latest.content, '_blank')
          } else {
            this.$message.warning("自我评估问卷缺少链接")
          }
        } else {
          this.$message.warning("暂无自我评估问卷")
        }
      })
    },
    changeLanguage(value) {
      this.$i18n.locale = value
      localStorage.setItem('locale', value)
    },
    search() {
      location.href = '/front/search?title=' + this.title
    },
    updateUser() {
      this.user = JSON.parse(localStorage.getItem('xm-user') || '{}')   // 重新获取下用户的最新信息
    },
    // 退出登录
    logout() {
      localStorage.removeItem("xm-user");
      localStorage.removeItem('locale')
      this.$router.push("/login");
    },
    // // 语言切换方法
    // toggleLanguage() {
    //   const currentLocale = this.$i18n.locale;
    //   this.$i18n.locale = currentLocale === 'zh' ? 'en' : 'zh';
    //   // 可选：记住用户选择，下次打开直接用
    //   localStorage.setItem('locale', this.$i18n.locale);
    // }
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

  .front-header-center {
    display: flex;
    align-items: center; /* ✅ 垂直居中 */
    padding: 0 10px;
    box-sizing: border-box;
  }

  .weather-wrapper {
    display: flex;
    align-items: center; /* ✅ 让 iframe 在容器内部居中 */
    height: 100%;
  }

  .main-body {
  margin-left: 260px;
  }
</style>