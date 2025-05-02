<template>
  <div class="main-content" style="width: 100%">
    <div id="chat-container" style=" top: 0px; left: 0px;width: 100%; height: 600px">

        <!-- 这里使用 methods 中的 showChatBot -->
<!--        <button type="button" @click="showChatBot">-->
<!--          Show chatbot-->
<!--        </button>-->
<!--        <button type="button" @click="hideChatBot">-->
<!--          hide chatbot-->
<!--        </button>-->
<!--        <div id="chat-container" style="position: absolute; top: 100px; left: 100px;width: 200px; height: 500px"></div>-->

    </div>
  </div>
</template>

<script>
export default {
  name: "Ai",
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      script: null,
      cozeClient: null,
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
  mounted() {
    this.showCoze()
    console.log(this.user)
  },
  methods: {
    async getNewToken() {
      const res = await axios.get('/api/refresh-token');
      return res.data.token;
    },
    hideCoze() {
      if (this.cozeClient) {
        this.cozeClient.destroy();  // 会完全销毁聊天组件
        this.cozeClient = null;
      }
    },
    showCoze() {
      console.log('coze')
      this.script = document.createElement("script");

      this.script.src = "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/cn/index.js";
      this.script.onload = () => {
        console.log('SDK 加载完毕！')
        this.cozeClient = new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: '7499496303970975744',  // 替换为你的 bot ID
            use_iframe: true, // 默认不显示聊天窗口
            isNeed: false,
          },
          componentProps: {
            title: '跨文化小助手',
          },
          auth: {
            type: 'token',
            token: this.user.token,

          },
          // 用户信息
          userInfo: {
            id: this.user.id,
            nickname: this.user.name,
            onRefreshToken: async () => {
              // 可选：实现 token 自动刷新逻辑
              const newToken = await this.getNewToken(); // 你封装的接口
              return newToken;
            }
          },
          ui: {
            base: {
              layout: 'pc'
            },
            header:{
              isShow: false,
              isNeedClose:false
            },
            footer: {
              isShow: false,
              expressionText: '',
              },
            asstBtn: {
              isNeed: false,
            },
            chatBot: {
              el: document.getElementById('chat-container'), // 👈 指定挂载的 DOM 元素
            }
          },

        });

        // SDK 加载完成后自动显示 ChatBot
        this.showChatBot();
      };
      document.body.appendChild(this.script);
    },
    showChatBot() {
      if (this.cozeClient) {
        this.cozeClient.showChatBot();  // 使用实例化的 cozeClient 调用方法
      } else {
        console.warn('Coze SDK is not initialized yet.');
      }
    },
    hideChatBot(){
      this.cozeClient.hideChatBot();  // 使用实例化的 cozeClient 调用方法
    },
    save() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/feedback/update' : '/feedback/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {
              this.$message.success('提交成功');
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
  }
}
</script>

<style>
.fa8097ff55eabaa5782b.d38f97c01009afb17492 {

  width: auto !important;

}

</style>
