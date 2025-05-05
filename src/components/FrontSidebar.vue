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

      <!-- 1. 文化讲堂 -->
<!--      <el-submenu index="1">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-reading"></i>-->
<!--          <span>{{ $t('menu.cultureForum') }}</span>-->
<!--        </template>-->
<!--        <el-menu-item index="/front/culture/power-distance">-->
<!--          <i class="el-icon-sort"></i>-->
<!--          {{ $t('menu.powerDistance') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/culture/individual-vs-group">-->
<!--          <i class="el-icon-user-solid"></i>-->
<!--          <span slot="title" class="scroll-title">-->
<!--            <span>{{ $t('menu.individualVsCollectivism') }}</span>-->
<!--          </span>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/culture/iceberg">-->
<!--          <i class="el-icon-ship"></i>-->
<!--          {{ $t('menu.icebergTheory') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/culture/adaptation">-->
<!--          <i class="el-icon-refresh"></i>-->
<!--          {{ $t('menu.culturalAdaptation') }}-->
<!--        </el-menu-item>-->
<!--      </el-submenu>-->

      <!-- 2. 中外传统文化 -->
<!--      <el-submenu index="2">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-suitcase"></i>-->
<!--          <span>{{ $t('menu.traditionCulture') }}</span>-->
<!--        </template>-->
<!--        <el-menu-item index="/front/tradition/food">-->
<!--          <i class="el-icon-ice-cream"></i>-->
<!--          {{ $t('menu.foodCulture') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/tradition/clothing">-->
<!--          <i class="el-icon-shopping-bag-2"></i>-->
<!--          {{ $t('menu.clothingCulture') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/tradition/etiquette">-->
<!--          <i class="el-icon-s-check"></i>-->
<!--          {{ $t('menu.etiquetteCulture') }}-->
<!--        </el-menu-item>-->
<!--      </el-submenu>-->

      <!-- 3. 中外节日习俗 -->
<!--      <el-submenu index="3">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-date"></i>-->
<!--          <span>{{ $t('menu.festivalCustoms') }}</span>-->
<!--        </template>-->
<!--        <el-menu-item index="/front/festival/overview">-->
<!--          <i class="el-icon-notebook-2"></i>-->
<!--          {{ $t('menu.festivalOverview') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/festival/customs">-->
<!--          <i class="el-icon-present"></i>-->
<!--          {{ $t('menu.festivalTraditions') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/festival/interaction">-->
<!--          <i class="el-icon-chat-dot-square"></i>-->
<!--          {{ $t('menu.festivalInteraction') }}-->
<!--        </el-menu-item>-->
<!--      </el-submenu>-->

      <!-- 4. 国内外文化动态 -->
<!--      <el-submenu index="4">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-truck"></i>-->
<!--          <span>{{ $t('menu.cultureNews') }}</span>-->
<!--        </template>-->
<!--        <el-menu-item index="/front/news/china">-->
<!--          <i class="el-icon-location-outline"></i>-->
<!--          {{ $t('menu.domesticCulture') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/news/global">-->
<!--          <i class="el-icon-position"></i>-->
<!--          {{ $t('menu.foreignCulture') }}-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/news/trending">-->
<!--          <i class="el-icon-star-on"></i>-->
<!--          <span slot="title" class="scroll-title">-->
<!--            <span>{{ $t('menu.hotTrends') }}</span>-->
<!--          </span>-->
<!--        </el-menu-item>-->
<!--      </el-submenu>-->

      <!-- 5. 跨文化交流 -->
<!--      <el-submenu index="5">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-connection"></i>-->
<!--          <span>{{ $t('menu.interculturalExchange') }}</span>-->
<!--        </template>-->
<!--        <el-menu-item index="/front/interculture/cases">-->
<!--          <i class="el-icon-document-copy"></i>-->
<!--          <span slot="title" class="scroll-title">-->
<!--            <span>{{ $t('menu.classicCases') }}</span>-->
<!--          </span>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="/front/interculture/forum">-->
<!--          <i class="el-icon-chat-line-round"></i>-->
<!--          {{ $t('menu.cultureForumAI') }}-->
<!--        </el-menu-item>-->
<!--      </el-submenu>-->
      <!-- ✅ 新增：动态拓展菜单 -->
      <el-submenu
          v-for="(menu, idx) in extraMenus"
          :key="'extra-' + idx"
          :index="menu.index"
      >
        <template slot="title">
            <i :class="menu.icon" ></i>
          <span>{{ menu.title }}</span>
        </template>
        <el-menu-item
            v-for="(child, i) in menu.children"
            :key="child.index"
            :index="child.index"
        >
          <i :class="child.icon" ></i>
          {{ child.title }}
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
          pageNum: 1, // 固定为 1，只用于取全量数据
          pageSize: 9999, // 设置一个足够大的数
        }
      }).then(res => {
        if (res.code === '200') {
          const all = res.data?.list || []
          this.allData = all
          console.log(all)
            // 一级分类：father 为 null
            let first = all.filter(item => item.father === null)
            if (this.name) {
              first = first.filter(item =>
                  item.name && item.name.includes(this.name)
              )
            }
            this.first = first
          console.log(this.first)
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
          console.log(this.second)
        } else {
          this.$message.error(res.msg)
        }

        this.first = this.first.sort((a, b) => a.id - b.id)
        this.second = this.second.sort((a, b) => a.id - b.id)

        this.extraMenus = this.first.map(parent => {
          return {
            index: String(parent.id),
            title: parent.name,
            icon: parent.icon,
            children: this.second
                .filter(child => String(child.father) === String(parent.id))
                .map(child => ({
                  index: `/front/extra/${child.id}`,
                  title: child.name,
                  icon: child.icon
                }))
          }
        })
      })
    }, reset() {
      this.name = null
      this.load(1)
    },


  }
}
</script>