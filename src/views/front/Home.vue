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
          <div @click="$router.push('/front/newsDetail?id=' + item.id)" class="card" v-for="item in tableData" :key="item.id">
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

        <div style="margin: 0.39vw 0" v-if="total > pageSize">
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
      <div class="right-section">
        <hot />

        <div style="margin: 0vw 0">
          <div style="font-size: 1vw; margin-bottom: 0.52vw">{{ $t('title.highlight') }}</div>
          <div style="margin-bottom: 0.36vw">
            <video controls style="width: 95%" :src="video.file"></video>
          </div>
          <div @click="loadVideo(item)" v-for="item in videoList" :key="item.id" class="video-item" :class="{'video-item-active': video.id === item.id}">
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
          pageNum: 1
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
.main-content {
  width: 81vw;
}
.main-layout {
  display: flex;
  gap: 0.52vw;
}
.left-section {
  width: 57.9vw;
}
.right-section {
  margin-left: 1vw;
  width: 26.1vw;
}
.category-item {
  max-width: 7.6vw;
  height: 1.6vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.26vw;
  border: 0.03vw solid #2a60c9;
  color: #2a60c9;
  border-radius: 0.13vw;
  margin-right: 0.32vw;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 0.64vw;
}
.category-item-active {
  background-color: #2a60c9;
  color: #fff;
}
.card {
  display: flex;
  cursor: pointer;
  gap: 0.49vw;
  margin-bottom: 0.13vw;
}
.card img {
  width: 5.91vw;
  height: 4.6vw;
  border-radius: 0.13vw;
  display: block;
}
.card-content {
  flex: 1;
}
.line1 {
  font-size: 0.9vw;
  margin-bottom: 0.26vw;
}
.line2 {
  color: #666;
  height: 1.4vw;
  margin-bottom: 0.13vw;
  font-size: 0.7vw;
}
.line1:hover {
  color: #409EFF !important;
}
.meta {
  color: #666;
  font-size: 0.68vw;
}
.video-item {
  margin-bottom: 0.28vw;
  font-size: 0.7vw;
  cursor: pointer;
}
.video-item img {
  width: 0.39vw;
  margin-right: 0.26vw;
}
.video-item:hover,
.video-item-active {
  color: #409EFF;
}
.category-scroll-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden; /* 避免遮罩被裁剪 */
  margin-top:0.7vw;
  margin-bottom: 0.7vw;
}

.category-scroll-outer {
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.category-scroll-outer::-webkit-scrollbar {
  display: none; /* Chrome */
}
.category-scroll-inner {
  display: inline-flex;
}

.scroll-gradient {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2.5vw;
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.scroll-gradient.left {
  left: 0;
  background: linear-gradient(to right, rgba(255,255,255,0.8), transparent);
}
.scroll-gradient.right {
  right: 0;
  background: linear-gradient(to left, rgba(255,255,255,0.8), transparent);
}
</style>
