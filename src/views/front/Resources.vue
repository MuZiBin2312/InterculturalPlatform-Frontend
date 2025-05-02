<template>
  <div class="container">
    <!-- 左侧导航栏 -->
<!--    <div class="sidebar">-->
<!--      <el-menu-->
<!--          default-active="all"-->
<!--          class="el-menu-vertical-demo"-->
<!--          @select="handleCategorySelect">-->
<!--        <el-menu-item index="all">全部</el-menu-item>-->
<!--        <el-menu-item index="传统文化">传统文化</el-menu-item>-->
<!--        <el-menu-item index="节日习俗">节日习俗</el-menu-item>-->
<!--        <el-menu-item index="热点关注">热点关注</el-menu-item>-->
<!--        <el-menu-item index="相关图志">相关图志</el-menu-item>-->
<!--      </el-menu>-->
<!--    </div>-->

    <!-- 右侧内容区 -->
    <div class="main-content">
      <div style="margin-bottom: 20px">
        <el-input size="medium" placeholder="请输入标题关键字查询" style="width: 300px" v-model="title"></el-input>
        <el-button size="medium" type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
        <el-button size="medium" type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
      </div>
      <div class="card" v-if="total > 0">
        <el-row :gutter="10">
          <el-col
              :span="8"
              v-for="item in tableData"
              :key="item.id"
              class="item"
              @click.native="$router.push('/front/newsDetail?id=' + item.id)">
            <img style="width: 100%; height: 240px; border-radius: 5px" :src="item.img" alt="">
            <div style="margin: 10px 0; font-size: 18px" class="line1">{{item.title }}</div>
            <div style="color: #666">
              <span style="margin-right: 20px"><i class="el-icon-eye"></i> {{ item.readCount }}</span>
              <span style="margin-right: 20px"><i class="el-icon-time"></i> {{ item.time }}</span>
              <span><i class="el-icon-s-comment"></i> {{ item.commentCount }}</span>
            </div>
          </el-col>
        </el-row>
        <div style="margin: 15px 0" v-if="total > pageSize">
          <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Resources",
  data() {
    return {
      tableData: [],  // 资源数据
      pageNum: 1,   // 当前页码
      pageSize: 10,  // 每页数量
      total: 0,      // 总数据量
      title: null,   // 关键字搜索
      activeCategory: "all",  // 当前选中的资源分类
    };
  },
  created() {
    this.load(1);
  },
  methods: {
    // 加载数据
    load(pageNum) {
      if (pageNum) this.pageNum = pageNum;
      this.$request.get('/news/selectLocalPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title: this.title,
          category: this.activeCategory === "all" ? null : this.activeCategory, // 传递筛选类型
        }
      }).then(res => {
        if (res.code === '200') {
          this.tableData = res.data?.list || [];
          this.total = res.data?.total || 0;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 重置查询
    reset() {
      this.title = null;
      this.load(1);
    },
    // 处理分页
    handleCurrentChange(pageNum) {
      this.load(pageNum);
    },
    // 选择分类筛选数据
    handleCategorySelect(category) {
      this.activeCategory = category;
      this.load(1); // 重新加载数据
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
}

.item {
  cursor: pointer;
  margin-bottom: 20px;
}
.item:hover .line1 {
  color: red;
}


</style>
