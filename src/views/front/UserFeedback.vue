<template>
  <div class="main-content">
    <div style="margin: 10px 0">
      <el-button type="danger" plain @click="delBatch">{{ $t('feedback.batchDelete') }}</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" :label="$t('feedback.id')" width="70" align="center" sortable></el-table-column>
        <el-table-column prop="title" :label="$t('feedback.title')"></el-table-column>
        <el-table-column prop="problem" :label="$t('feedback.problem')"></el-table-column>
        <el-table-column prop="idea" :label="$t('feedback.idea')"></el-table-column>
        <el-table-column prop="time" :label="$t('feedback.submitTime')"></el-table-column>
        <el-table-column prop="reply" :label="$t('feedback.reply')"></el-table-column>
        <el-table-column prop="replyTime" :label="$t('feedback.replyTime')"></el-table-column>
        <el-table-column :label="$t('feedback.actions')" align="center" width="100">
          <template v-slot="scope">
            <el-button size="mini" type="danger" plain @click="del(scope.row.id)">{{ $t('feedback.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin: 10px 0" v-if="total > pageSize">
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

    <el-dialog :title="$t('feedback.dialogTitle')" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item :label="$t('feedback.reply')" prop="reply">
          <el-input type="textarea" v-model="form.reply" :placeholder="$t('feedback.replyPlaceholder')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">{{ $t('feedback.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('feedback.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  title: "Feedback",
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      title: null,
      fromVisible: false,
      form: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
      },
      ids: []
    }
  },
  created() {
    this.load(1)
  },
  methods: {
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    handleEdit(row) {   // 编辑数据
      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
      this.fromVisible = true   // 打开弹窗
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/feedback/update' : '/feedback/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.$message.success(this.$t('common.saveSuccess'))
              this.load(1)
              this.fromVisible = false
            } else {
              this.$message.error(res.msg)  // 弹出错误的信息
            }
          })
        }
      })
    },
    del(id) {   // 单个删除
      this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.deleteTitle'), { type: 'warning',confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel') }).then(response => {
        this.$request.delete('/feedback/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success(this.$t('common.operationSuccess'))
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(rows) {   // 当前选中的所有的行数据
      this.ids = rows.map(v => v.id)
    },
    delBatch() {   // 批量删除
      if (!this.ids.length) {
        this.$message.warning(this.$t('common.pleaseChooseData'))
        return
      }
      this.$confirm(
          this.$t('common.batchDeleteMessage'),
          this.$t('common.batchDeleteTitle'),
          {
            type: "warning",
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
          }
      ).then(response => {
        this.$request.delete('/feedback/delete/batch', {data: this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success(this.$t('common.operationSuccess'))
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    load(pageNum) {  // 分页查询
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/feedback/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          title: this.title,
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
    reset() {
      this.title = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
  }
}
</script>

<style scoped>

</style>