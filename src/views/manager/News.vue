<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入标题关键字查询" style="width: 200px" v-model="title"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <div class="operation" style="margin-top: 10px;margin-bottom: 10px;">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" strip @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="序号" width="70" align="center" sortable></el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="descr" label="简介" show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="category" label="分类"></el-table-column>-->
        <el-table-column label="一级菜单">
          <template v-slot="scope">
                        {{ getFatherName(scope.row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="二级菜单">
          <template v-slot="scope">
            {{ getSecName(scope.row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" width="100">
          <template v-slot="scope">
            <el-button @click="preview(scope.row.content)">查看内容</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="img" label="配图">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 50px;" v-if="scope.row.img"
                        :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发布时间"></el-table-column>
        <el-table-column prop="readCount" label="阅读量"></el-table-column>
        <el-table-column
            prop="type"
            label="展示位置"
            :formatter="typeFormatter">
        </el-table-column>
        <el-table-column
            prop="userId"
            label="发布人"
            :formatter="formatUser">
        </el-table-column>        <el-table-column prop="status" label="发布状态">
          <template v-slot="scope">
            <el-tag type="info" v-if="scope.row.status === '待审核'">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === '通过'">通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status === '拒绝'">拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center" width="180" v-if="user.role === 'ADMIN'">
          <template v-slot="scope">
            <el-button v-if="scope.row.type === 'local'" size="mini" type="success" plain @click="changeStatus(scope.row, '通过')">通过</el-button>
            <el-button v-if="scope.row.type === 'local'" size="mini" type="danger" plain @click="changeStatus(scope.row, '拒绝')">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
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

    <el-dialog title="文章信息" :visible.sync="fromVisible" width="50%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="descr">
          <el-input v-model="form.descr" placeholder="资讯简介"></el-input>
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
        <el-form-item label="资讯内容" prop="content">
          <input type="file" accept=".docx" @change="handleWordUpload" />

          <div id="editor"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="资讯内容" :visible.sync="fromVisible1" width="50%" :close-on-click-modal="false" destroy-on-close>
      <div class="w-e-text">
        <div v-html="content"></div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible1 = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import E from "wangeditor"
import mammoth from "mammoth";

export default {
  title: "News",
  data() {
    return {
      extraMenus: [
        {
          index: "100",
          title: this.$t('menu.extraBlock'),
          icon: "el-icon-menu",
          children: [
            {
              index: "/front/extra/one",
              title: this.$t('menu.extraItem1'),
              icon: "el-icon-document",
            },
            {
              index: "/front/extra/two",
              title: this.$t('menu.extraItem2'),
              icon: "el-icon-edit",
            }
          ]
        },
        {
          index: "100",
          title: this.$t('menu.extraBlock'),
          icon: "el-icon-menu",
          children: [
            {
              index: "/front/extra/one",
              title: this.$t('menu.extraItem1'),
              icon: "el-icon-document",
            },
            {
              index: "/front/extra/two",
              title: this.$t('menu.extraItem2'),
              icon: "el-icon-edit",
            }
          ]
        }
      ],
      category:null,
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 12,  // 每页显示的个数
      total: 0,
      title: null,
      fromVisible: false,
      form: {
        first: null,
        category: null  // ❗️注意是 null，而不是 '' 字符串
      },
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
      },
      ids: [],
      editor: null,
      content: '',
      fromVisible1: false,
      categoryList: [],
      first:[],
      second:[],
      nsc:null,
      allTableData: [],

    }
  },
  // 当一级分类变化时触发此方法
  watch: {
    'form.first'(newVal) {

      console.log(this.form)
      if (newVal) {
        this.category = this.second.filter(item => String(item.father) === String(newVal));
      } else {
        this.category = []
      }
      this.$set(this.form, 'category', null);    },
  },
  mounted() {
  },
  created() {
    this.load(1)

    this.$request.get('/category/selectAll').then(res => {
      this.categoryList = res.data || []
    })
    this.loadDynamicMenus() // 加这句！

  },
  methods: {
    formatUser(row) {
      return row.userId ? row.userId : '管理员';
    },
    typeFormatter(row) {
      // 假设 type 为 1 就显示 '一'，其他照样返回
      const map = {
        'common': '首页',
        'local': '栏目',// 可继续添加
      }
      return map[row.type] || row.type;
    },
    getFatherName(category) {

      const sec = this.second.find(item => String(item.id) === String(category));
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
    // 一级分类改变时的处理函数
    handleFirstChange() {
      // 清空二级分类的选择
      this.form.category = '' // ✅ 直接清空成字符串

      // this.form.category = null;
      // 重新加载二级分类
      this.loadSecondCategory();
    },

    // 加载二级分类
    loadSecondCategory() {

      if (this.form.first) {
        // 根据一级分类的 index 筛选二级分类
        this.category = this.second.filter(item => String(item.father) === String(this.form.first));

      } else {
        // 清空二级分类
        this.category = [];
      }
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
          console.log(this.extraMenus)
        } else {
          this.$message.error(res.msg)
        }
      } catch (err) {
        console.error('加载分类失败', err)
        this.$message.error('加载分类失败')
      }
    },


    changeStatus(row, status) {
      this.form = JSON.parse(JSON.stringify(row))
      this.form.status = status
      this.$confirm('您确定'+status+'吗？', '确认审核', {type: "warning"}).then(response => {
        this.$request.put('/news/update', this.form).then(res => {
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
      this.content = content
      this.fromVisible1 = true
    },
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
      this.setRichText('')
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
            url: this.form.id ? '/news/update' : '/news/add',
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
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/news/delete/' + id).then(res => {
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
        this.$request.delete('/news/delete/batch', {data: this.ids}).then(res => {
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

    load(pageNum) {
      if (pageNum) this.pageNum = pageNum

      this.$request.get('/news/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.user.role === 'TEACHER'? this.user.id : -1,
          title: this.title,
        }
      }).then(res => {
        if (res.code === '200') {
          let list = res.data?.list || []
          this.total = res.data.total // 其他角色使用接口返回的 total
          this.tableData = list
        } else {
          this.$message.error(res.msg)
        }
      })
    }
    ,

    reset() {
      this.title = null
      this.load(1)
      this.name = null
      this.filterFatherId = null
      this.loadDynamicMenus()
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    handleImgSuccess(response, file, fileList) {
      this.form.img = response.data
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
    handleWordUpload(event) {
      const file = event.target.files[0];
      if (!file || file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.$message.error('请上传有效的 Word (.docx) 文件');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          this.editor.txt.html(result.value);
          this.$message.success('Word 内容已导入');
        } catch (error) {
          this.$message.error('Word 解析失败');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }
}
</script>

<style scoped>

</style>