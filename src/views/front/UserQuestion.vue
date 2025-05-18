<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="main-content">
    <div class="search">
      <el-input :placeholder="$t('topic.searchPlaceholder')" style="width: 200px" v-model="title"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">{{ $t('common.search') }}</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">{{ $t('common.reset') }}</el-button>
    </div>

    <div class="operation" style="margin-top: 10px;margin-bottom: 10px;">
      <el-button type="primary" plain @click="handleAdd">{{ $t('common.add') }}</el-button>
      <el-button type="danger" plain @click="delBatch">{{ $t('common.deleteBatch') }}</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" strip @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" :label="$t('common.id')" width="70" align="center" sortable></el-table-column>
        <el-table-column prop="title" :label="$t('topic.title')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="descr" :label="$t('topic.descr')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="img" :label="$t('topic.image')">
          <template v-slot="scope">
            <el-image v-if="scope.row.img" style="width: 50px" :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="userId" :label="$t('topic.userId')"></el-table-column>
        <el-table-column prop="userName" :label="$t('topic.userName')"></el-table-column>
        <el-table-column prop="date" :label="$t('topic.date')"></el-table-column>
        <el-table-column prop="readCount" :label="$t('topic.readCount')"></el-table-column>
        <el-table-column prop="status" :label="$t('topic.status')">
          <template v-slot="scope">
            <el-tag type="info" v-if="scope.row.status === '待审核'">{{ $t('status.pending') }}</el-tag>
            <el-tag type="success" v-if="scope.row.status === '通过'">{{ $t('status.approved') }}</el-tag>
            <el-tag type="danger" v-if="scope.row.status === '拒绝'">{{ $t('status.rejected') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" align="center" width="150">
          <template v-slot="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button size="mini" type="danger" plain @click="del(scope.row.id)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <span>{{ $t('table.noData') }}</span>
        </template>
      </el-table>

      <div style="margin: 15px 0">
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

    <el-dialog :title="$t('topic.dialogTitle')" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item :label="$t('topic.title')" prop="title">
          <el-input v-model="form.title" :placeholder="$t('topic.title')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('topic.category')" prop="category">
          <el-select v-model="form.category" :placeholder="$t('topic.selectCategory')">
            <el-option :label="$t('category.interactive')" :value="3"></el-option>
            <el-option :label="$t('category.culture')" :value="2" v-if="user.role === 'TEACHER'"></el-option>
            <el-option :label="$t('category.case')" :value="1" v-if="user.role === 'TEACHER'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('topic.descr')" prop="descr">
          <el-input type="textarea" v-model="form.descr" :placeholder="$t('topic.descr')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('topic.image')" prop="img">
          <el-upload
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              list-type="picture"
              :on-success="handleImgSuccess"
          >
            <el-button type="primary">{{ $t('topic.upload') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  title: "Question",
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
    changeStatus(row, status) {
      this.form = JSON.parse(JSON.stringify(row))
      this.form.status = status
      this.$confirm('您确定'+status+'吗？', '确认审核', {type: "warning"}).then(response => {
        this.$request.put('/question/update', this.form).then(res => {
          if (res.code === '200') {
            this.$message.success('审核成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(e => {})
    },
    handleAdd() {   // 新增数据
      this.form = {

      }  // 新增数据的时候清空数据
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
            url: this.form.id ? '/question/update' : '/question/add',
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
        this.$request.delete('/question/delete/' + id).then(res => {
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
        this.$request.delete('/question/delete/batch', {data: this.ids}).then(res => {
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
      this.$request.get('/question/selectPage', {
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
    handleImgSuccess(response, file, fileList) {
      this.form.img = response.data
    },
  }
}
</script>

<style scoped>

</style>