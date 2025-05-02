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
<!--      <el-menu-item index="/front/question">-->
<!--        <i class="el-icon-edit-outline"></i>-->
<!--        <span slot="title">{{ $t('menu.Q&A') }}</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/front/localNews">-->
<!--        <i class="el-icon-news"></i>-->
<!--        <span slot="title">{{ $t('menu.hotspots') }}</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/front/resources">-->
<!--        <i class="el-icon-folder-opened"></i>-->
<!--        <span slot="title">{{ $t('menu.resources') }}</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/front/video">-->
<!--        <i class="el-icon-video-camera"></i>-->
<!--        <span slot="title">{{ $t('menu.videos') }}</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/front/feedback">-->
<!--        <i class="el-icon-message"></i>-->
<!--        <span slot="title">{{ $t('menu.feedback') }}</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/front/notice">-->
<!--        <i class="el-icon-bell"></i>-->
<!--        <span slot="title">{{ $t('menu.notice') }}</span>-->
<!--      </el-menu-item>-->

      <!-- 1. 文化讲堂 -->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-reading"></i>
          <span>{{ $t('menu.cultureForum') }}</span>
        </template>
        <el-menu-item index="/front/culture/power-distance">
          <i class="el-icon-sort"></i>
          {{ $t('menu.powerDistance') }}
        </el-menu-item>
        <el-menu-item index="/front/culture/individual-vs-group">
          <i class="el-icon-user-solid"></i>
          <span slot="title" class="scroll-title"><span>{{ $t('menu.individualVsCollectivism') }}</span></span>
        </el-menu-item>
        <el-menu-item index="/front/culture/iceberg">
          <i class="el-icon-ship"></i>
          {{ $t('menu.icebergTheory') }}
        </el-menu-item>
        <el-menu-item index="/front/culture/adaptation">
          <i class="el-icon-refresh"></i>
          {{ $t('menu.culturalAdaptation') }}
        </el-menu-item>
      </el-submenu>

      <!-- 2. 中外传统文化 -->
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-suitcase"></i>
          <span>{{ $t('menu.traditionCulture') }}</span>
        </template>
        <el-menu-item index="/front/tradition/food">
          <i class="el-icon-ice-cream"></i>
          {{ $t('menu.foodCulture') }}
        </el-menu-item>
        <el-menu-item index="/front/tradition/clothing">
          <i class="el-icon-shopping-bag-2"></i>
          {{ $t('menu.clothingCulture') }}
        </el-menu-item>
        <el-menu-item index="/front/tradition/etiquette">
          <i class="el-icon-s-check"></i>
          {{ $t('menu.etiquetteCulture') }}
        </el-menu-item>
      </el-submenu>

      <!-- 3. 中外节日习俗 -->
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-date"></i>
          <span>{{ $t('menu.festivalCustoms') }}</span>
        </template>
        <el-menu-item index="/front/festival/overview">
          <i class="el-icon-notebook-2"></i>
          {{ $t('menu.festivalOverview') }}
        </el-menu-item>
        <el-menu-item index="/front/festival/customs">
          <i class="el-icon-present"></i>
          {{ $t('menu.festivalTraditions') }}
        </el-menu-item>
        <el-menu-item index="/front/festival/interaction">
          <i class="el-icon-chat-dot-square"></i>
          {{ $t('menu.festivalInteraction') }}
        </el-menu-item>
      </el-submenu>

      <!-- 4. 国内外文化动态 -->
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-truck"></i>
          <span>{{ $t('menu.cultureNews') }}</span>
        </template>
        <el-menu-item index="/front/news/china">
          <i class="el-icon-location-outline"></i>
          {{ $t('menu.domesticCulture') }}
        </el-menu-item>
        <el-menu-item index="/front/news/global">
          <i class="el-icon-position"></i>
          {{ $t('menu.foreignCulture') }}
        </el-menu-item>
        <el-menu-item index="/front/news/trending">
          <i class="el-icon-star-on"></i>
          <span slot="title" class="scroll-title"><span>{{ $t('menu.hotTrends') }}</span></span>
        </el-menu-item>
      </el-submenu>

      <!-- 5. 跨文化交流 -->
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-connection"></i>
          <span>{{ $t('menu.interculturalExchange') }}</span>
        </template>
        <el-menu-item index="/front/interculture/cases">
          <i class="el-icon-document-copy"></i>
          <span slot="title" class="scroll-title"><span>{{ $t('menu.classicCases') }}</span></span>
        </el-menu-item>
        <el-menu-item index="/front/interculture/forum">
          <i class="el-icon-chat-line-round"></i>
          {{ $t('menu.cultureForumAI') }}
        </el-menu-item>
      </el-submenu>

      <!-- 6. AI赋能 -->
      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-cpu"></i>
          <span>{{ $t('menu.aiEmpowerment') }}</span>
        </template>
        <el-menu-item index="/front/ai/agents">
          <i class="el-icon-service"></i>
          {{ $t('menu.aiAgent') }}
        </el-menu-item>
      </el-submenu>

      <el-submenu index="7">
        <template slot="title">
          <i class="el-icon-connection"></i>
          <span>{{ $t('menu.upload') }}</span>
        </template>
        <el-menu-item index="/front/uploadNews">
          <i class="el-icon-document-copy"></i>
          <span slot="title" class="scroll-title"><span>{{ $t('menu.uploadNews') }}</span></span>
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
  max-width: 280px; /* 根据你的菜单栏宽度调整 */
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.scroll-title span {
  display: inline-block;
  transition: transform 10s linear;
  will-change: transform;
}

/* 悬停时开始滚动 */
.scroll-title:hover span {
  transform: translateX(calc(-100% + 120px)); /* 120px 为容器宽度，保持尾部显示 */
}

@import "@/assets/css/manager.css";
</style>
<script lang="ts">
</script>