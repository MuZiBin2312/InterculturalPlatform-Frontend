<template>
  <div class="main-content" style="width: 100%">

    <div id="chat-container" style="top: 0px; left: 0px;width: 100%; height: 45vw">
      <!-- 如果需要按钮控制聊天框的显示与隐藏 -->
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        problem: [
          {required: true, message: '请输入问题', trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.showCoze();
    console.log(this.user.token);
  },
  methods: {
    // 刷新 token
    async refreshToken() {
      try {
        const newToken = await this.getNewToken();
        if (newToken) {
          return newToken;
        } else {
          throw new Error("无法获取新 token");
        }
      } catch (error) {
        console.error('Token刷新失败:', error);
        return null;
      }
    },

    // 获取新 token
    async getNewToken() {
      const refreshToken = this.user.token;  // 获取到的旧的refresh token
      const res = await axios.post('http://localhost:9090/api/refresh-token', {
        token: refreshToken,  // 传递 refreshToken 给后端
        userId: this.user.id
      });
      console.log(res.data);
      return res.data.token;
    },

    // 隐藏聊天窗口
    hideCoze() {
      if (this.cozeClient) {
        this.cozeClient.destroy();  // 会完全销毁聊天组件
        this.cozeClient = null;
      }
    },
    // deleteAllChat() {
    //   console.log('删除')
    //   const axios = require('axios');
    //
    //   const token = 'pat_zW03DE8JLV1BgsBCd53c1gavvE20yKHa812FS9rMkZPb7Ptj7Q1W3hdH24RC9baJ'; // 替换为您的访问令牌
    //
    //   async function deleteAllConversations() {
    //     try {
    //       // 获取会话列表
    //       const listResponse = await axios.get('https://api.coze.com/v1/conversations', {
    //         headers: {Authorization: `Bearer pat_zW03DE8JLV1BgsBCd53c1gavvE20yKHa812FS9rMkZPb7Ptj7Q1W3hdH24RC9baJ`},
    //       });
    //
    //       const conversations = listResponse.data.conversations;
    //
    //       // 删除每个会话
    //       for (const conv of conversations) {
    //         await axios.delete(`https://api.coze.com/v1/conversations/${conv.id}`, {
    //           headers: {Authorization: `Bearer ${token}`},
    //         });
    //         console.log(`Deleted conversation: ${conv.id}`);
    //       }
    //     } catch (error) {
    //       console.error('Error deleting conversations:', error);
    //     }
    //   }
    //
    //   deleteAllConversations();
    // },

    // 显示聊天窗口
    showCoze() {
      console.log('coze');
      this.script = document.createElement("script");

      this.script.src = "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/cn/index.js";
      this.script.onload = () => {
        // console.log(this.user.token);
        // 获取新 token
        // const newToken = await this.refreshToken(); // 使用 async 函数获取新的 token

        // if (newToken) {
        // 初始化聊天组件
        this.cozeClient = new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: '7499496303970975744',  // 替换为你的 bot ID
            use_iframe: true, // 默认不显示聊天窗口
            isNeed: false,
          },

          componentProps: {
            title: '跨文化小助手',
            icon:false
          },
          // auth: {
          //   type: 'token',
          //   token: this.user.token,  // 使用获取的新的 token
          //   onRefreshToken: this.refreshToken, // 调用外部同步方法进行刷新 token
          // },
          auth: {
            type: 'token',
            token: 'pat_43dXKE539Ao9R4tkIqk7ZEWqLuaU78qKs5iiwVqPGCbNtGoZThzBB19nVPN27b8L',
            onRefreshToken: function () {
              return 'pat_43dXKE539Ao9R4tkIqk7ZEWqLuaU78qKs5iiwVqPGCbNtGoZThzBB19nVPN27b8L'
            }
          },
          // 用户信息
          userInfo: {
            nickname: this.user.name,
          },
          ui: {
            base: {},
            header: {
              isShow: true,
              isNeedClose: false,
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
            },
          },
        });

        // SDK 加载完成后自动显示 ChatBot
        this.showChatBot();
        // }
      };
      document.body.appendChild(this.script);
      // this.deleteAllChat()
    },

    // 显示聊天机器人
    showChatBot() {
      if (this.cozeClient) {
        this.cozeClient.showChatBot();  // 使用实例化的 cozeClient 调用方法
      } else {
        console.warn('Coze SDK is not initialized yet.');
      }
    },

    // 隐藏聊天机器人
    hideChatBot() {
      if (this.cozeClient) {
        this.cozeClient.hideChatBot();  // 使用实例化的 cozeClient 调用方法
      }
    },

    // 表单提交
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