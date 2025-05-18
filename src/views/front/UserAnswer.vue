<template>
  <div class="main-content">

    <div style="margin: 10px 0">
      <el-button type="danger" plain @click="delBatch">{{ $t('reply.batchDelete') }}</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" :label="$t('reply.id')" width="70" align="center" sortable></el-table-column>
        <el-table-column prop="questionTitle" :label="$t('reply.topicTitle')"></el-table-column>
        <el-table-column :label="$t('reply.viewContent')">
          <template v-slot="scope">
            <el-button @click="preview(scope.row.content)">{{ $t('reply.viewContent') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" :label="$t('reply.replier')"></el-table-column>
        <el-table-column prop="time" :label="$t('reply.replyTime')"></el-table-column>
        <el-table-column prop="status" :label="$t('reply.status')">
          <template v-slot="scope">
            <el-tag type="info" v-if="scope.row.status === '待审核'">{{ $t('reply.pending') }}</el-tag>
            <el-tag type="success" v-if="scope.row.status === '通过'">{{ $t('reply.approved') }}</el-tag>
            <el-tag type="danger" v-if="scope.row.status === '拒绝'">{{ $t('reply.rejected') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('reply.actions')" align="center" width="220">
          <template v-slot="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">{{ $t('reply.edit') }}</el-button>
            <el-button size="mini" type="danger" plain @click="del(scope.row.id)">{{ $t('reply.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin: 15px 0">
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

    <el-dialog :title="$t('reply.dialogTitleEdit')" :visible.sync="fromVisible" width="50%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item :label="$t('reply.content')" prop="content">
          <div id="editor"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">{{ $t('reply.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('reply.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('reply.dialogTitleView')" :visible.sync="fromVisible1" width="50%" :close-on-click-modal="false" destroy-on-close>
      <div class="w-e-text">
        <div v-html="previewContent"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible1 = false">{{ $t('reply.close') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  content: "Answer",
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      content: null,
      fromVisible: false,
      form: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
      },
      ids: [],
      editor: null,
      previewContent: '',
      fromVisible1: false,
    }
  },
  created() {
    this.load(1)
  },
  methods: {
    changeStatus(row, status) {
      this.form = JSON.parse(JSON.stringify(row))
      this.form.status = status
      this.$confirm('您确定'+status+'吗？', '确认审核', {type: "warning"}).then(response => {
        this.$request.put('/answer/update', this.form).then(res => {
          if (res.code === '200') {
            this.$message.success('审核成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(e => {})
    },
    preview(content) {
      this.previewContent = content
      this.fromVisible1 = true
    },
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    handleEdit(row) {   // 编辑数据
      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
      this.fromVisible = true   // 打开弹窗
      this.setRichText(this.form.content)
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.form.content = this.editor.txt.html()
          this.$request({
            url: this.form.id ? '/answer/update' : '/answer/add',
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
    del(id) {   // 单个删除
      this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.deleteTitle'), { type: 'warning',confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel') }).then(response => {
        this.$request.delete('/answer/delete/' + id).then(res => {
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
        this.$request.delete('/answer/delete/batch', {data: this.ids}).then(res => {
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
      this.$request.get('/answer/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          content: this.content,
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
      this.content = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    setRichText(html) {
      this.$nextTick(() => {
        this.editor = new E(`#editor`)
        this.editor.config.uploadImgServer = this.$baseUrl + '/files/editor/upload'
        this.editor.config.uploadFileName = 'file'
        this.editor.config.uploadImgHeaders = {
          token: this.user.token
        }
        this.editor.config.uploadImgParams = {
          type: 'img',
        }
        this.editor.config.zIndex = 0
        this.editor.create()  // 创建
        this.editor.txt.html(html)
      })
    },
  }
}
</script>

<style scoped>

</style>