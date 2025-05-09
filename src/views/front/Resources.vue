<template>
  <div class="container">
    <div class="main-content">
      <div style="margin-bottom: 20px">
        <el-input size="medium" placeholder="请输入标题关键字查询" style="width: 300px" v-model="title" />

        <el-select v-model="type" placeholder="请选择类型" style="margin-left: 10px; width: 150px">
          <el-option label="资讯文章" value="article" />
          <el-option label="视频" value="video" />
        </el-select>

        <el-button size="medium" type="info" plain style="margin-left: 10px" @click="load(1)">{{ $t('button.query') }}</el-button>
        <el-button size="medium" type="warning" plain style="margin-left: 10px" @click="reset">{{ $t('button.reset') }}</el-button>
      </div>

      <div v-if="tableData.length > 0">
        <el-row :gutter="10">
          <!-- 文章渲染 -->
          <el-col
              v-if="type === 'article'"
              :span="8"
              v-for="item in tableData"
              :key="item.id"
              class="item"
              @click.native="$router.push('/front/newsDetail?id=' + item.id)"
          >
            <img :src="item.img" alt="" style="width: 100%; height: 360px; object-fit: cover; border-radius: 5px;" />
            <div class="line1" style="margin: 10px 0; font-size: 18px;">{{ item.title }}</div>
            <div style="color: #666;">
              <span style="margin-right: 20px;"><i class="el-icon-eye"></i> {{ item.readCount }}</span>
              <span style="margin-right: 20px;"><i class="el-icon-time"></i> {{ item.time }}</span>
              <span><i class="el-icon-s-comment"></i> {{ item.commentCount }}</span>
            </div>
          </el-col>

          <!-- 视频渲染 -->
          <el-col
              v-if="type === 'video'"
              :span="8"
              v-for="item in tableData"
              :key="item.id"
              class="item"
          >
            <video :src="item.file" controls @click="play(item)" style="width: 100%; height: 200px; border-radius: 5px;" />
            <div style="margin: 10px 0; font-size: 16px;">{{ item.name }}</div>
            <div style="color: #666;">
              <span style="margin-right: 20px;">发布时间：{{ item.time }}</span>
              <span>播放量：{{ item.readCount }}</span>
            </div>
          </el-col>
        </el-row>

        <!-- 分页 -->
        <div style="margin: 15px 0" >
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

      <div v-else style="text-align: center; color: #999; margin-top: 20px;">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResourcePage",
  data() {
    return {
      title: null,
      type: "article", // 默认展示
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 6,
      rawData: [],
      categoryId: null, // ✅ 新增：用于存储 query 中的 category id
    };
  },
  watch: {
    // 监听路由参数变化
    '$route.query.id'(newId) {
      if (newId) {
        this.categoryId = newId;
        this.load(1); // 路由参数变化时，重新加载数据
      }
    },
    type() {
      this.load(1); // 资源类型变动时重新加载
    }
  },
  created() {
    // ✅ 改动点：读取 query 参数 name，作为分类 ID 使用
    this.categoryId = this.$route.query.id;
    this.load(1);
  },
  methods: {
    load(pageNum) {
      this.pageNum = pageNum;

      const params = {
        title: this.title,
        categoryId: this.categoryId,
      };

      let api = this.type === 'video' ? '/video/selectPage' : '/news/selectAllPage';

      if (this.type === 'video') {
        params.name = this.title;
        delete params.title;
      }

      this.$request.get(api, { params }).then(res => {
        if (res.code === '200') {
          let allData = res.data.list;

          // ✅ 改动点：按分类过滤数据（假设每项都有 category 字段）
          if (this.categoryId) {
            allData = allData.filter(item => item.category === this.categoryId);
          }

          this.rawData = allData;
          this.total = allData.length;

          const start = (this.pageNum - 1) * this.pageSize;
          const end = start + this.pageSize;
          this.tableData = allData.slice(start, end);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    reset() {
      this.title = null;
      this.load(1);
    },
    handleCurrentChange(newPage) {
      this.load(newPage);
    },
    play(item) {
      this.$request.put('/video/updateCount/' + item.id).then(() => {
        item.readCount += 1;
      });
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
