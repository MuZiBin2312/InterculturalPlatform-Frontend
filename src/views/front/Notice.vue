<template>
  <div class="main-content" style="width: 50%">
    <el-timeline-item
        :color="'#0bbd87'"
        :timestamp="item.time"
        placement="top"
        v-for="item in noticeList"
        :key="item.id"
        v-if="item.category === 1 || item.category === 2"
    >
      <el-card>
        <template v-if="item.category === 1">
          <h3 style="margin-bottom: 10px; font-weight: bold">{{ item.title }}</h3>
          <p style="line-height: 24px">{{ item.content }}</p>
        </template>
        <template v-else-if="item.category === 2">
          <h3 style="margin-bottom: 10px; font-weight: bold">
            <a href="#" @click="handleClick(item.content)" style="color: #409EFF">{{ item.title }}</a>
          </h3>
        </template>
      </el-card>
    </el-timeline-item>
  </div>
</template>

<script>
export default {
  name: "FNotice",
  data() {
    return {
      noticeList: []
    }
  },
  created() {
    this.$request.get('/notice/selectAll').then(res => {
      this.noticeList = res.data || []
    })
  },
  methods: {
    handleClick(link) {
      // 使用 window.open 来在新标签页中打开链接
      window.open(link, '_blank');
    }
  }
}
</script>

<style scoped>

</style>