<!-- src/components/FrontSidebar.vue -->
<template>
  <div class="front-sidebar">
    <el-menu
        :default-active="$route.path"
        router
        class="el-menu-vertical-demo"
        background-color="#011223"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-menu-item index="/front/home">
        <i class="el-icon-house"></i>
        <span slot="title">{{ $t('menu.home') }}</span>
      </el-menu-item>


      <!-- ✅ 新增：动态拓展菜单 -->
      <el-submenu
          v-for="(menu, idx) in extraMenus"
          :key="'extra-' + idx"
          :index="menu.index"
      >
        <template slot="title">
            <i :class="menu.icon" ></i>
          <span>{{ $t(menu.title) }}</span>
        </template>
        <el-menu-item
            v-for="(child, i) in menu.children"
            :key="child.index"
            :index="child.index"
        >
          <i :class="child.icon" ></i>
          {{ $t(child.title) }}
        </el-menu-item>
      </el-submenu>

      <!-- 5. 跨文化交流 -->
      <el-submenu index="9999999999999998">
        <template slot="title">
          <i class="el-icon-connection"></i>
          <span>{{ $t('menu.interculturalExchange') }}</span>
        </template>
        <el-menu-item index="/front/question?category=1">
          <i class="el-icon-document-copy"></i>
          <span slot="title" class="scroll-title">
            <span>{{ $t('menu.classicCases') }}</span>
          </span>
        </el-menu-item>
        <el-menu-item index="/front/question?category=2">
          <i class="el-icon-chat-line-round"></i>
          {{ $t('menu.cultureForumAI') }}
        </el-menu-item>
      </el-submenu>
      <!-- 6. AI赋能 -->
      <el-submenu index="9999999999999999">
        <template slot="title">
          <i class="el-icon-cpu"></i>
          <span>{{ $t('menu.aiEmpowerment') }}</span>
        </template>
        <el-menu-item index="/front/ai">
          <i class="el-icon-service"></i>
          {{ $t('menu.aiAgent') }}
        </el-menu-item>
      </el-submenu>

      <!-- 7. 教师上传 -->
      <el-submenu index="99999999999999999" v-if="user.role === 'TEACHER'">
        <template slot="title">
          <i class="el-icon-connection"></i>
          <span>{{ $t('menu.upload') }}</span>
        </template>
        <el-menu-item index="/front/uploadNews">
          <i class="el-icon-document-copy"></i>
          <span slot="title" class="scroll-title">
            <span>{{ $t('menu.uploadNews') }}</span>
          </span>
        </el-menu-item>
        <el-menu-item index="/front/uploadVideo">
          <i class="el-icon-chat-line-round"></i>
          {{ $t('menu.uploadVideos') }}
        </el-menu-item>
        <el-menu-item index="/front/userQuestion">
          <i class="el-icon-chat-line-round"></i>
          {{ $t('menu.myQuestion') }}
        </el-menu-item>
        <el-menu-item index="/front/uploadNotice">
          <i class="el-icon-chat-line-round"></i>
          {{ $t('menu.uploadNotice') }}
        </el-menu-item>
      </el-submenu>
<!--      公告与反馈-->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-warning-outline"></i>
                <span>{{ $t('menu.announcementAndFeedback') }}</span>
              </template>
              <el-menu-item index="/front/Notice">
                <i class="el-icon-bell"></i>
                {{ $t('menu.announcements') }}
              </el-menu-item>
              <el-menu-item index="/front/Feedback">
                <i class="el-icon-chat-dot-square"></i>
                {{ $t('menu.feedback') }}
              </el-menu-item>
            </el-submenu>


    </el-menu>
  </div>
</template>

<style scoped>
.scroll-title {
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}
.scroll-title span {
  display: inline-block;
  transition: transform 10s linear;
  will-change: transform;
}
.scroll-title:hover span {
  transform: translateX(calc(-100% + 120px));
}
@import "@/assets/css/manager.css";
</style>

<script lang="ts">
import Footer from "@/components/Footer.vue";

export default {
  name: "FrontLayout",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("xm-user") || '{}'),
      extraMenus: [
        {
          index: "100",
          title: this.$t('menu.extraBlock'),
          icon: "el-icon-menu",
          children: [
            {
              index: "/front/extra/one",
              title: this.$t('menu.extraItem1'),
              icon: "el-icon-document",
            },
            {
              index: "/front/extra/two",
              title: this.$t('menu.extraItem2'),
              icon: "el-icon-edit",
            }
          ]
        },
        {
          index: "100",
          title: this.$t('menu.extraBlock'),
          icon: "el-icon-menu",
          children: [
            {
              index: "/front/extra/one",
              title: this.$t('menu.extraItem1'),
              icon: "el-icon-document",
            },
            {
              index: "/front/extra/two",
              title: this.$t('menu.extraItem2'),
              icon: "el-icon-edit",
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.loadDynamicMenus();
  },
  methods: {
    async loadDynamicMenus() {
      // 不传 name 参数给后端，完全获取所有分类数据
      this.$request.get('/category/selectPage', {
        params: {
          pageNum: 1,
          pageSize: 9999
        }
      }).then(res => {
        if (res.code === '200') {
          const all = res.data?.list || []
          this.allData = all

          // 一级分类：father 为 null
          let first = all.filter(item => item.father === null)
          if (this.name) {
            first = first.filter(item =>
                item.name && item.name.includes(this.name)
            )
          }
          this.first = first

          // 二级分类：father 不为 null
          let second = all.filter(item => item.father !== null)
          if (this.name) {
            second = second.filter(item =>
                item.name && item.name.includes(this.name)
            )
          }
          if (this.filterFatherId) {
            second = second.filter(item =>
                item.father == this.filterFatherId
            )
          }
          this.second = second

          this.first = this.first.sort((a, b) => a.id - b.id)
          this.second = this.second.sort((a, b) => a.id - b.id)


          this.extraMenus = this.first.map(parent => {
            const children = []
            this.second
                .filter(child => String(child.father) === String(parent.id))
                .forEach(child => {
                  children.push({
                    index: `/front/resources?id=${child.id}`,
                    title: `menu.${child.name}`,
                    icon: child.icon
                  })


                  if (child.name === '节日习俗') {
                    children.push({
                      index: "/front/question?category=3",
                      title: "menu.互动体验",
                      icon: "el-icon-magic-stick"
                    })
                  }
                })

            return {
              index: String(parent.id),
              title: `menu.${parent.name}`,
              icon: parent.icon,
              children: children
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
    ,
    reset() {
      this.name = null
      this.load(1)
    },


  }
}
</script>

<style scoped>
.front-sidebar{
  margin-top: 2.4vw;
  position: fixed;             /* 让它固定在页面左侧 */
  height: 51vw;
  overflow-y: auto;            /* 当内容超出时显示垂直滚动条 */
  z-index: 1000;              /* 保证在其他元素之上 */
}

</style>