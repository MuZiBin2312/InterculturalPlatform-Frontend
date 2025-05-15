<template>
  <div>
    <div style="width:90%;">
      <div style="display: flex; align-items: center; margin-bottom: 20px">
        <!-- 使用动态图片路径 -->
        <img :src="hotImg" alt="" style="width: 70px;height:45px" />
        <div style="flex: 1; text-align: right;">
<span @click="loadHot" style="font-size: 1vw; cursor: pointer">
            <i class="el-icon-refresh"></i> {{ $t('button.refresh') }}
          </span>
        </div>
      </div>
      <div>
        <div @click="$router.push('/front/newsDetail?id=' + item.id)"
             v-for="(item, index) in hotNewsList" :key="item.id"
             style="font-size: 1vw; margin-bottom: 10px; cursor: pointer; color: #666"
             class="line1">
          <strong style="color: red; margin-right: 10px" v-if="index < 3">{{ index + 1 }}</strong>
          <strong style="color: #333; margin-right: 10px" v-else>{{ index + 1 }}</strong>
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Hot",
  data() {
    return {
      hotNewsList: [],
      hotImg: require('@/assets/imgs/hot.png') // 默认图片
    }
  },
  computed: {
    locale() {
      return this.$i18n.locale
    }
  },
  watch: {
    locale(newVal) {
      this.updateImage(newVal)
    }
  },
  created() {
    this.loadHot()
    this.updateImage(this.locale) // 初始化图片
  },
  methods: {
    loadHot() {
      this.$request.get('/news/selectHot').then(res => {
        this.hotNewsList = res.data || []
      })
    },
    updateImage(locale) {
      this.hotImg = locale === 'zh'
          ? require('@/assets/imgs/hot.png')
          : require('@/assets/imgs/hot2.png')
    }
  }
}
</script>

<style scoped>
.line1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
