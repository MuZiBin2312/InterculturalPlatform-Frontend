<template>
  <div class="main-content" style="width: 50%">
    <div class="card">
      <div style="margin-bottom: 30px; text-align: center; font-size: 24px">{{ $t('text.lookingForwardToYourVoice') }}</div>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item :label="$t('text.title')" prop="title">
          <el-input size="medium" v-model="form.title" :placeholder="$t('text.enterTheReply')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('text.question')" prop="problem">
          <el-input type="textarea" size="medium" v-model="form.problem" :placeholder="$t('text.enterTheQuestion')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('text.idea')" prop="idea">
          <el-input type="textarea" size="medium" v-model="form.idea" :placeholder="$t('text.enterTheIdea')"></el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button size="medium" type="primary" @click="save">{{ $t('button.submitFeedback') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Feedback",
  data() {
    return {
      form: {},
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        problem: [
          { required: true, message: '请输入问题', trigger: 'blur' }
        ],
      }
    }
  },
  created() {

  },
  methods: {
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/feedback/update' : '/feedback/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.$message.success('提交成功')
              this.form = {}
            } else {
              this.$message.error(res.msg)  // 弹出错误的信息
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>