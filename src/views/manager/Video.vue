<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入标题关键字查询" style="width: 200px" v-model="name"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <div class="operation">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">

        <el-table
            :data="tableData"
            stripe
            @selection-change="handleSelectionChange"
            style="width: 100%"
        >
          <el-table-column
              type="selection"
              align="center"
              min-width="50"
          ></el-table-column>

          <el-table-column
              prop="id"
              label="序号"
              align="center"
              sortable
              min-width="70"
          ></el-table-column>

          <el-table-column
              prop="name"
              label="名称"
              min-width="120"
          ></el-table-column>

          <el-table-column
              label="一级菜单"
              min-width="120"
          >
            <template v-slot="scope">
              {{ getFatherName(scope.row.category) }}
            </template>
          </el-table-column>

          <el-table-column
              prop="category"
              label="二级菜单"
              min-width="120"
          >
            <template v-slot="scope">
              {{ getSecName(scope.row.category) }}
            </template>
          </el-table-column>

          <el-table-column
              prop="file"
              label="视频"
              width="220"
          >
            <template v-slot="scope">
              <video
                  :src="scope.row.file"
                  controls
                  width="200"
                  height="112"
                  style="border-radius: 4px; object-fit: cover"
              ></video>
            </template>
          </el-table-column>

          <el-table-column
              prop="time"
              label="发布时间"
              min-width="160"
          ></el-table-column>

          <el-table-column
              prop="readCount"
              label="播放次数"
              min-width="100"
          ></el-table-column>

          <el-table-column
              label="操作"
              align="center"
              min-width="180"
          >
            <template v-slot="scope">
              <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click="del(scope.row.id)"
              >
                删除
              </el-button>
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

    <el-dialog title="视频信息" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="一级分类" prop="category">
          <el-select v-model="form.first" @change="" style="width: 100%">
            <el-option
                v-for="item in first"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select
              v-model="form.category"
              :disabled="!form.first"
              placeholder="请选择二级分类"
              style="width: 100%"
          >
            <el-option
                v-for="item in category"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频" prop="file">
          <el-upload
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              :on-success="handleFileSuccess"
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
  name: "Video",
  data() {
    return {
      category:null,

      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 8,  // 每页显示的个数
      total: 0,
      name: null,
      fromVisible: false,
      form: {
        category: null
      },
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
      },
      ids: []
    }
  },
  async created() {
    await this.loadDynamicMenus() // 加这句！
    this.load(1)
  },
  watch: {
    'form.first'(newVal) {
      if (newVal) {
        this.category = this.second.filter(item => String(item.father) === String(newVal));
      } else {
        this.category = [];
      }
      this.$set(this.form, 'category', null);  // 每次切换一级分类时清空二级分类
    }
  },
  methods: {
    getFatherName(category) {

      const sec = this.second.find(item => String(item.id) === String(category));
      console.log(sec)
      const fir = this.first.find(item => String(item.id) === String(sec.father));

      // 4. 返回一级菜单的 name
      return fir.name;
    },
    getSecName(category) {

      const sec = this.second.find(item => String(item.id) === String(category));
      console.log(sec)
      if (!sec) return category;  // 保险处理：找不到一级就返回原始
      return sec.name;
    },
    async loadDynamicMenus() {
      try {
        const res = await this.$request.get('/category/selectPage', {
          params: { pageNum: 1, pageSize: 9999 }
        })

        if (res.code === '200') {
          const all = res.data?.list || []
          this.allData = all

          let first = all.filter(item => item.father === null)
          let second = all.filter(item => item.father !== null)

          if (this.name) {
            first = first.filter(item => item.name?.includes(this.name))
            second = second.filter(item => item.name?.includes(this.name))
          }

          if (this.filterFatherId != null) {
            second = second.filter(item => String(item.father) === String(this.filterFatherId))
          }

          this.first = first.sort((a, b) => a.id - b.id)
          this.second = second.sort((a, b) => a.id - b.id)

          this.extraMenus = this.first.map(parent => {
            return {
              index: String(parent.id),
              title: parent.name,
              icon: parent.icon,
              children: this.second
                  .filter(child => String(child.father) === String(parent.id))
                  .map(child => ({
                    index: `/front/extra/${child.id}`,
                    title: child.name,
                    icon: child.icon
                  }))
            }
          })
          console.log('news.vue')

        } else {
          this.$message.error(res.msg)
        }
      } catch (err) {
        console.error('加载分类失败', err)
        this.$message.error('加载分类失败')
      }
    },


    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    handleEdit(row) {
      // 拷贝 row，防止直接修改原始数据
      this.form = JSON.parse(JSON.stringify(row));

      // 根据二级分类的 id 找到分类对象
      const categoryItem = this.second.find(item => String(item.id) === String(row.category));

      if (categoryItem) {
        const firstId = categoryItem.father;

        // 1. 根据 father ID 找一级分类对象
        const firstItem = this.first.find(item => String(item.id) === String(firstId));

        // 2. 设置二级分类下拉选项
        this.category = this.second.filter(item => String(item.father) === String(firstId));

        // 3. 设置表单中的分类名称
        this.$set(this.form, 'first', firstItem ? firstItem.name : null); // 设置一级分类为 name
        this.$nextTick(() => {
          this.$set(this.form, 'category', categoryItem.name); // 设置二级分类为 name
        });
      } else {
        // 如果没找到，清空相关字段
        this.$set(this.form, 'first', null);
        this.category = [];
        this.$set(this.form, 'category', null);
      }

      this.fromVisible = true;
    },
    save() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$message.success(this.user.id)
          this.form.userId = this.user.id

          // 把 first（name）转成 id
          const firstItem = this.first.find(item => item.name === this.form.first);
          const firstId = firstItem ? firstItem.id : this.form.first;

          // 把 category（name）转成 id
          const categoryItem = this.second.find(item => item.name === this.form.category);
          const categoryId = categoryItem ? categoryItem.id : this.form.category;

          // 复制一份 form 并替换 first、category 字段
          const submitForm = {
            ...this.form,
            first: firstId,
            category: categoryId
          };

          this.$request({
            url: this.form.id ? '/video/update' : '/video/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: submitForm
          }).then(res => {
            if (res.code === '200') {
              this.$message.success('保存成功');
              this.load(1);
              this.fromVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/video/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
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
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确定批量删除这些数据吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/video/delete/batch', {data: this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
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
      this.$request.get('/video/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
        }
      }).then(res => {
        if (res.code === '200') {
          let list = res.data?.list || []

          // 权限过滤逻辑：TEACHER 只看自己的数据
          if (this.user.role === 'TEACHER') {
            list = list.filter(item => item.userId === this.user.id)
            this.total = list.length
          } else {
            this.total = res.data?.total
          }

          this.tableData = list
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    reset() {
      this.name = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    handleFileSuccess(response, file, fileList) {
      this.form.file = response.data
    },
  }
}
</script>

<style scoped>

</style>