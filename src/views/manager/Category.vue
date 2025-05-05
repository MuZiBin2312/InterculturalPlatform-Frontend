<template>
  <div>
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="一级菜单" name="category">
        <div class="search">
          <el-input placeholder="请输入关键字查询" style="width: 200px" v-model="name"></el-input>
          <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
          <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
        </div>
        <div class="operation">
          <el-button type="primary" plain @click="handleAdd('category')">新增</el-button>
          <el-button type="danger" plain @click="delBatch">批量删除</el-button>

        </div>

        <div class="table">
          <el-table :data="categoryData" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="序号" width="70" align="center" sortable></el-table-column>
            <el-table-column label="图标" align="center" width="170">
              <template v-slot="scope">
                <i :class="scope.row.icon" style="font-size: 20px;"></i>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="一级菜单"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template v-slot="scope">
                <el-button size="mini" type="primary" plain @click="handleEdit(scope.row, 'category')">编辑</el-button>
                <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
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
      </el-tab-pane>

      <el-tab-pane label="二级菜单" name="other">
        <div class="search">
          <el-input
              placeholder="请输入关键字查询"
              style="width: 200px"
              v-model="name"
          ></el-input>

          <!-- 新增：一级菜单筛选 -->
          <el-select
              v-model="filterFatherId"
              placeholder="请选择一级菜单"
              clearable
              style="width: 200px; margin-left: 10px"
              @change="load(1)"
          >
            <el-option
                v-for="item in fatherOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>

          <el-button
              type="info"
              plain
              style="margin-left: 10px"
              @click="load(1)"
          >查询</el-button>

          <el-button
              type="warning"
              plain
              style="margin-left: 10px"
              @click="reset"
          >重置</el-button>
        </div>

        <div class="operation">
          <el-button type="primary" plain @click="handleAdd('other')">新增</el-button>
          <el-button type="danger" plain @click="delBatch">批量删除</el-button>
        </div>

        <div class="table">
          <el-table :data="tableData" stripe @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="序号" width="70" align="center" sortable></el-table-column>
            <el-table-column label="图标" align="center" width="170">
              <template v-slot="scope">
                <i :class="scope.row.icon" style="font-size: 20px;"></i>
              </template>
            </el-table-column>
            <el-table-column label="一级菜单">
              <template v-slot="scope">
                {{ getFatherName(scope.row.father) }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="二级菜单"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template v-slot="scope">
                <el-button size="mini" type="primary" plain @click="handleEdit(scope.row, 'other')">编辑</el-button>
                <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
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
      </el-tab-pane>    </el-tabs>

    <!-- 弹窗对话框 -->
    <el-dialog title="菜单" :visible.sync="formVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标类名，如 el-icon-s-home 或 fa fa-user"></el-input>
        </el-form-item>

        <el-form-item v-if="currentTab === 'other'" label="一级菜单" prop="father">

          <el-select v-model="form.father" placeholder="请选择一级菜单" style="width: 100%">
            <el-option
                v-for="item in fatherOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="菜单名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      filterFatherId:null,
      currentTab: 'category', // 用于控制弹窗显示
      activeTab: 'category',
      fatherOptions: [],
      tableData: [],
      categoryData: [], // 存储一级菜单数据
      allData: [],  // 用于存储完整数据
      pageNum: 1,
      pageSize: 10,
      total: 0,
      name: null,
      formVisible: false,
      form: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
        name: [{ required: true, message: '请输入二级菜单', trigger: 'blur' }],
        father: [{ required: true, message: '请输入一级菜单', trigger: 'blur' }]
      },
      ids: []
    }
  },
  created() {
    this.load(1)
  },
  watch: {
    activeTab() {
      this.name = null
      this.pageNum = 1
      this.load(1)
    }
  },
  methods: {
    getFatherName(fatherId) {
      const parent = this.allData.find(item => String(item.id) === fatherId)
      return parent ? parent.name : '—'
    },
    handleAdd(tab) {
      this.form = { father: tab === 'category' ? null : null }
      this.currentTab = tab
      this.formVisible = true
    },
    handleEdit(row, tab) {
      this.form = {
        ...row,
        father: row.father ? Number(row.father) : null
      }
      this.currentTab = tab
      this.formVisible = true
    },
    save() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/category/update' : '/category/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {
              this.$message.success('保存成功')
              this.load(1)
              this.formVisible = false
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    del(id) {
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(() => {
        this.$request.delete('/category/delete/' + id).then(res => {
          if (res.code === '200') {
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    delBatch() {
      if (!this.ids.length) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确定批量删除这些数据吗？', '确认删除', {type: "warning"}).then(() => {
        this.$request.delete('/category/delete/batch', {data: this.ids}).then(res => {
          if (res.code === '200') {
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    load(pageNum) {
      if (pageNum) this.pageNum = pageNum

      // 不传 name 参数给后端，完全获取所有菜单数据
      this.$request.get('/category/selectPage', {
        params: {
          pageNum: 1, // 固定为 1，只用于取全量数据
          pageSize: 9999, // 设置一个足够大的数
        }
      }).then(res => {
        if (res.code === '200') {
          const all = res.data?.list || []
          this.allData = all

          if (this.activeTab === 'category') {
            // 一级菜单：father 为 null，支持 name 模糊匹配
            let filtered = all.filter(item => item.father === null)
            if (this.name) {
              filtered = filtered.filter(item =>
                  item.name && item.name.includes(this.name)
              )
            }
            this.categoryData = filtered
            this.total = filtered.length

            // 分页
            const start = (this.pageNum - 1) * this.pageSize
            const end = this.pageNum * this.pageSize
            this.categoryData = filtered.slice(start, end)
          } else {
            // 二级菜单：father 不为 null，支持 name 和 filterFatherId 筛选
            let filtered = all.filter(item => item.father !== null)
            if (this.name) {
              filtered = filtered.filter(item =>
                  item.name && item.name.includes(this.name)
              )
            }
            if (this.filterFatherId) {
              filtered = filtered.filter(item =>
                  item.father == this.filterFatherId
              )
            }

            this.tableData = filtered
            this.total = filtered.length

            // 分页
            const start = (this.pageNum - 1) * this.pageSize
            const end = this.pageNum * this.pageSize
            this.tableData = filtered.slice(start, end)

            // 一级菜单选项
            this.fatherOptions = all.filter(item => item.father === null)
          }

        } else {
          this.$message.error(res.msg)
        }
      })
    },    reset() {
      this.name = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    handleSelectionChange(rows) {
      this.ids = rows.map(v => v.id)
    }
  }
}
</script>