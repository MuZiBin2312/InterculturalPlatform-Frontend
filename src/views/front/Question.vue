<template>
  <div style="width: 60%; margin: 10px auto">
    <div style="display: flex; align-items: flex-start; grid-gap: 15px">
      <div style="flex: 1" class="card">
        <div @click="$router.push('/front/questionDetail?id=' + item.id)" v-for="(item, index) in tableData" :key="item.id" class="item">
          <div style="width: 20px; padding-top: 10px">
            <div v-if="index < 3" style="width: 10px; height: 10px; background-color: orangered; border-radius: 50%"></div>
            <div v-else style="width: 10px; height: 10px; background-color: #2a60c9; border-radius: 50%"></div>
          </div>
          <div style="flex: 1; width: 0">
            <div style="font-size: 20px; margin-bottom: 10px" class="title line2">{{ item.title }}</div>
            <div style="color: #666" class="line2">{{ item.title }}</div>
          </div>
          <div>
            <img :src="item.img" alt="" style="width: 150px; height: 100px; border-radius: 5px">
          </div>
        </div>

        <div style="margin: 20px 0">
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

      <div style="width: 300px">
        <div style="display: flex; margin-bottom: 10px">
          <img src="@/assets/imgs/问.png" alt="" style="width: 20px; height: 20px; margin-top: 5px; margin-right: 5px">
          <span style="font-size: 20px">{{ $t('text.waitingYourAnswer') }}</span>
          <el-button v-if="!(category === '1' && user.role === 'USER') && !(category === '2' && user.role === 'USER')"
                     @click="handleAdd" type="primary"
                     plain size="mini" icon="el-icon-edit"
                     style="margin-left : 84px">{{ $t('button.initiateQuestion') }}</el-button>
        </div>
        <div v-for="item in noAnswerList" :key="item.id">
          <div class="card" v-if="category === String(item.category)"  style="margin-bottom: 10px">
            <div style="margin-bottom: 10px; font-size: 16px">{{ item.title }}</div>
            <div style="color: #888; display: flex">
              <div style="flex: 1">{{ item.date }}</div>
              <el-button @click="$router.push('/front/questionDetail?id=' + item.id)" type="primary" size="mini" icon="el-icon-edit">{{ $t('button.answerIt') }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="话题讨论" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="问题类型" prop="category">
          <el-input v-model="form.categoryLabel" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="descr">
          <el-input type="textarea" v-model="form.descr" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="配图" prop="img">
          <el-upload
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              list-type="picture"
              :on-success="handleImgSuccess"
          >
            <el-button type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Question",
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      noAnswerList: [],
      category: null,
      form:{},
      fromVisible: false,
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
    }
  },
  created() {
    this.load(1)
    this.loadNoAnswer()
  },
  watch: {
    '$route.query.category': {
      immediate: true,
      handler(newCategory) {
        console.log('切换 ID:', newCategory)
        this.category = newCategory  // 根据新的 id 加载数据
        this.load(1)
      }
    }
  },
  methods: {
    loadNoAnswer() {
      this.$request.get('/question/selectNoAnswer', {
        params: { category: this.category }
      }).then(res => {
        this.noAnswerList = res.data || []
        console.log("noAnswerList", res.data)
      })
    },
    load(pageNum) {  // 分页查询
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/question/selectFrontPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          category: this.category  // ✅ 添加分类参数
        }
      }).then(res => {
        if (res.code === '200') {
          this.tableData = res.data?.list
          this.total = res.data?.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    handleAdd() {   // 新增数据
      this.form = {
        category: parseInt(this.category),
        categoryLabel: this.getCategoryLabel(parseInt(this.category))
      }  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    getCategoryLabel(category) {
      switch (category) {
        case 1: return '案例讨论'
        case 2: return '文化讨论'
        case 3: return '互动体验'
        default: return ''
      }
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/question/update' : '/question/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.$message.success('保存成功')
              this.load(1)
              this.fromVisible = false
            } else {
              this.$message.error(res.msg)  // 弹出错误的信息
            }
          })
        }
      })
    },
    handleImgSuccess(response, file, fileList) {
      this.form.img = response.data
    },
  }
}
</script>

<style scoped>
.item {
  display: flex;
  margin-bottom: 15px;
  cursor: pointer;
}
.item:hover .title {
  color: orangered;
}
</style>