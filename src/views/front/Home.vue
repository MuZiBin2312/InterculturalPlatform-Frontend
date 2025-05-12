<template>
  <div class="main-content">
    <div class="main-layout">
      <!-- 左侧部分开始 -->
      <div class="left-section">
        <el-carousel height="18vw">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <a :href="'/front/newsDetail?id=' + item.newsId" target="_blank">
              <img :src="item.img" alt="" style="width: 100%">
            </a>
          </el-carousel-item>
        </el-carousel>

        <div class="category-scroll-wrapper" :style="{ width: categoryWidth }">
          <!-- 左侧遮罩提示 -->
          <div class="scroll-gradient left" v-show="showLeftHint"></div>

          <!-- 可滚动分类按钮区域 -->
          <div
              ref="categoryScroll"
              class="category-scroll-outer"
              @scroll="handleScroll"
          >
            <div class="category-scroll-inner">
              <!-- 所有分类按钮 -->
              <div
                  @click="loadCategoryNews(null)"
                  class="category-item"
                  :class="{ 'category-item-active': category === null }"
              >
                {{ $t('menu.全部') }}
              </div>
              <div
                  v-for="item in filteredCategoryList"
                  v-if="item?.father"
                  :key="item.id"
                  @click="loadCategoryNews(item.id)"
                  class="category-item"
                  :class="{ 'category-item-active': category === item.id }"
              >
                {{ $t('menu.' + item.name) || item.name }}
              </div>
            </div>
          </div>

          <!-- 右侧遮罩提示 -->
          <div class="scroll-gradient right" v-show="showRightHint"></div>
        </div>


        <div>
          <div @click="$router.push('/front/newsDetail?id=' + item.id)" class="card" v-for="item in tableData"
               :key="item.id">
            <img :src="item.img" alt="">
            <div class="card-content">
              <div class="line1">{{ item.title }}</div>
              <div class="line2">{{ item.descr }}</div>
              <div class="meta">
                <span><i class="el-icon-time"></i> {{ item.time }}</span>
                <span><i class="el-icon-s-comment" style="margin-left: 0.5vw;"></i> {{ item.commentCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="margin: 3vw 0" v-if="total > pageSize">
          <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total"
          />
        </div>
      </div>

      <!-- 右侧部分开始 -->
      <!-- 右侧部分开始 -->
      <!-- 右侧部分开始 -->
      <div class="right-section" style="padding-right: 0.5vw
">
        <hot/>

        <div class="right-section-top">
          <div class="video-title">{{ $t('title.highlight') }}</div>
          <div class="video-box">
            <video controls style="width: 95%" :src="video.file"></video>
          </div>
          <div
              @click="loadVideo(item)"
              v-for="item in videoList"
              :key="item.id"
              class="video-item"
              :class="{ 'video-item-active': video.id === item.id }"
          >
            <img src="@/assets/imgs/play.gif" alt="" v-if="video.id === item.id">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import Hot from "@/components/Hot";

export default {
  components: {Hot},
  data() {
    return {
      bannerList: [],
      categoryList: [],
      category: null,
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 4,  // 每页显示的个数
      total: 0,
      video: {},
      videoList: [],
      categoryWidth: '54vw', // 你可以自定义调整这个宽度
      showLeftHint: true,
      showRightHint: true,
    }
  },
  computed: {
    filteredCategoryList() {
      // 只返回父分类不为空的项
      console.log(this.categoryList)
      return this.categoryList.filter(item => item.father)
    }
  },
  mounted() {
    this.loadBanner()
    this.loadCategory()
    this.load(1)
    this.loadVideo(null)
    this.$nextTick(() => {
      this.updateScrollHints()
    })
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    handleScroll() {
      this.updateScrollHints()
    },
    updateScrollHints() {
      const scroll = this.$refs.categoryScroll
      if (!scroll) return

      this.showLeftHint = scroll.scrollLeft > 10
      this.showRightHint = scroll.scrollLeft + scroll.clientWidth < scroll.scrollWidth - 10
    },
    loadVideo(item) {
      this.$request.get('/video/selectPage', {
        params: {
          pageNum: 1,
          pageSize: 7  // 控制只取 5 条视频

        }
      }).then(res => {
        this.videoList = res.data?.list || []
        if (item) {
          this.video = item
        } else {
          this.video = this.videoList.length ? this.videoList[0] : {}
        }
      })
    },
    loadBanner() {
      this.$request.get('/banner/selectAll').then(res => [
        this.bannerList = res.data || []
      ])
    },
    loadCategory() {
      this.$request.get('/category/selectAll').then(res => [
        this.categoryList = res.data || []
      ])
    },
    loadCategoryNews(name) {
      this.category = name
      this.load(1)
    },
    load(pageNum) {  // 分页查询
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/news/selectFrontPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          category: this.category,
        }
      }).then(res => {
        if (res.code === '200') {
          this.tableData = res.data?.list
          this.total = res.data?.total
          console.log(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
  }
}
</script>

<style scoped>
/* 全局样式 */
html, body {
  overflow-x: hidden;
}

body {
  overflow-x: hidden;
}

/* 主体布局 */
.main-layout {
  box-sizing: border-box;
  display: flex;
  gap: 0.52vw;
}

.main-content {
  width: 81vw;
}

.left-section {
  width: 54vw;
}

.right-section {
  position: fixed;
  top: 2.4vw;
  right: 0;
  width: 27vw;
  height: 98vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 1vw;
  overflow-y: auto;
  margin-bottom: 2.4vw;
}

/* 分类滚动区域 */
.category-scroll-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 0.7vw 0;
}

.category-scroll-outer {
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.category-scroll-outer::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.category-scroll-inner {
  display: inline-flex;
}

/* 分类项样式 */
.category-item {
  max-width: 11.02vw;
  height: 2.32vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.377vw;
  border: 0.0435vw solid #2a60c9;
  color: #2a60c9;
  border-radius: 0.1885vw;
  margin-right: 0.464vw;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 0.928vw;
}

.category-item-active {
  background-color: #2a60c9;
  color: #fff;
}

/* 卡片样式 */
.card {

  padding-bottom: 1.5vw;
  display: flex;
  cursor: pointer;
  gap: 0.49vw;
  overflow: hidden; /* 确保超出的内容不显示 */
  max-width: 83%;
  margin-bottom: 0.13vw;
  transform: scale(1.2); /* 放大1.2倍 */
  transform-origin: top left; /* 保证从左上角开始放大 */
}

.card img {
  width: 7.09vw; /* 放大图片 */
  height: 5.52vw; /* 放大图片 */
  border-radius: 0.15vw;
  display: block;
}

.card-content {
  flex: 1 1 0%;
  min-width: 0;
  max-width: 80%; /* 控制最大宽度，避免被压缩 */
  overflow: hidden;
  position: relative; /* 新增：为定位参考点 */

}

.line1 {
  font-size: 1.08vw;
  margin-bottom: 0.31vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.line2 {
  color: #666;
  font-size: 0.84vw;
  margin-bottom: 0.16vw;
  overflow: hidden; /* 强制隐藏超出部分 */
  text-overflow: ellipsis;
  max-width: 100%; /* 确保宽度限制，省略号生效 */
}


.meta {
  color: #666;
  font-size: 0.82vw;
  position: absolute; /* 新增：进行绝对定位 */
  bottom: 0; /* 贴底 */
}

/* 视频区域样式 */
.right-section-top {
  width: 100%;
  padding: 1vw 0;
}

.video-title {
  font-size: 1.2vw;
  margin-bottom: 0.52vw;
}

.video-box {
  margin-bottom: 0.36vw;
}

.video-item {
  font-size: 1vw;
  margin-bottom: 1vw;
  margin-left: 1vw;
  cursor: pointer;
}


.video-item img {
  width: 1vw;
  margin-right: 0.26vw;
}

.video-item:hover,
.video-item-active {
  font-size: 1vw;

  color: #409EFF;
}

/* 渐变箭头遮罩样式 */
.scroll-gradient {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2.5vw;
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-gradient.left {
  left: 0;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.8), transparent);
}

/* 左箭头 */
.scroll-gradient.left::before {
  content: '';
  display: block;
  width: 0.6vw;
  height: 0.6vw;
  border: solid #000b17; /* 左箭头颜色，改为红色 */
  border-width: 0.12vw 0.12vw 0 0;
  transform: rotate(-135deg); /* 右箭头旋转方向 */
  transform-origin: center; /* 设置旋转原点为中心 */
  opacity: 0.7; /* 左箭头透明度 */
}

/* 右箭头 */
.scroll-gradient.right::before {
  content: '';
  display: block;
  width: 0.6vw;
  height: 0.6vw;
  border: solid #000b17; /* 右箭头颜色，改为蓝色 */
  border-width: 0.12vw 0.12vw 0 0;
  transform: rotate(45deg); /* 左箭头旋转方向 */

  transform-origin: center; /* 设置旋转原点为中心 */
  opacity: 0.9; /* 右箭头透明度 */
}


.scroll-gradient.right {
  right: 0;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
}

.scroll-gradient::before {
  content: '';
  display: block;
  width: 0.6vw;
  height: 0.6vw;
  border: solid #999;
  border-width: 0.12vw 0.12vw 0 0;
  transform: rotate(15deg);
  opacity: 0.6;
}

/* 分类选项的 hover 效果 */
.category-item:hover {
  background-color: #b3d4ff; /* 浅蓝色背景 */
}


</style>
