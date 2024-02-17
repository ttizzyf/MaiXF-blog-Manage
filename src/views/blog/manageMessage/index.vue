<script lang="ts" setup>
import "@/styles/index.scss";
import { reactive, ref, watch } from "vue";
import {
  getManageMessageList,
  newCreateComment,
  updateBlogCommentLikeOrOppose,
  updateComment,
  deleteComment,
} from "@/api/blog.ts";
import { Search } from "@element-plus/icons-vue";
import WComment from "@/components/WComment.vue";
import { getArticleCommentType } from "@/types/blog.ts";
import { themeSetting } from "@/store/theme";
import { setCookie } from "@/utils/cookies.ts";
import { WNotification } from "@/utils/toast";
const theme = themeSetting();
// 搜索栏值
const searchInput = ref();
// 搜索留言参数
const commentParams: getArticleCommentType = reactive({
  pageNum: 1,
  pageSize: 10,
  comment: "",
});
// 留言总数
const commentTotal = ref();

const manageMessageList: any = ref([]);

// 输入框值改变
const commentChange = () => {
  commentParams.pageNum = 1;
  commentParams.comment = searchInput.value;
  console.log(commentParams);
};

// 获取文章评论列表
const getManageMessageListAPI = async () => {
  const res = await getManageMessageList(commentParams);
  commentTotal.value = res.data.data.count;
  manageMessageList.value = res.data.data.data;
  console.log(manageMessageList.value);
};

watch(
  () => commentParams,
  () => {
    getManageMessageListAPI();
  },
  { immediate: true, deep: true }
);

// 回复留言
const submitReplyMessage = async (info: any) => {
  const res = await newCreateComment(info);
  if (res.data.status) {
    WNotification.success("回复成功");
    getManageMessageListAPI();
  }
};

// 提交点赞消息
const submitLikeMessages = (id: string) => {
  updateBlogCommentLikeOrOppose({ id, likeOrOppose: "like" }).then((res) => {
    if (res.data.status) {
      setCookie(`comment-like-${id}`, true, 30);
      getManageMessageListAPI();
    }
  });
};

// 提交反对消息
const submitOpposeMessages = (id: string) => {
  updateBlogCommentLikeOrOppose({ id, likeOrOppose: "Oppose" }).then((res) => {
    if (res.data.status) {
      setCookie(`comment-oppose-${id}`, true, 30);
      getManageMessageListAPI();
    }
  });
};

// 修改和新建评论的表单
const dialogData = ref({
  messageId: "",
  content: "",
});

// 修改和新建评论的规则
const messageRules = reactive({
  content: [{ required: true, message: "评论内容不能为空", trigger: "blur" }],
});

// 弹层控制
const dialogController = ref(false);

// 关闭弹层
const closeDialog = () => {
  dialogController.value = false;
  dialogData.value = {
    messageId: "",
    content: "",
  };
  messageFormDom.value.resetFields();
};

const messageFormDom = ref();

// 新增文章评论或留言
const submitCreateComment = async () => {
  if (!dialogData.value.messageId) {
    // 新增留言或评论
    const res = await newCreateComment(dialogData.value);
    if (res.data.status) {
      WNotification.success(res.data.message);
      getManageMessageListAPI();
    }
  } else {
    // 修改留言或评论
    const res = await updateComment(dialogData.value);
    console.log(res);
    if (res.data.status) {
      WNotification.success(res.data.message);
      getManageMessageListAPI();
    }
  }
  closeDialog();
};

// 修改评论
const submitModifyMessages = (message: any) => {
  dialogData.value.content = message.content;
  dialogData.value.messageId = message.messageId;
  dialogController.value = true;
};

// 删除留言或评论
const submitDeleteMessages = async (id: string) => {
  const res = await deleteComment({ messageId: id });
  if (res.data.status) {
    WNotification.success(res.data.message);
    // 当删除评论时，需要重新获取文章列表,当文章删除后小于总数则pageNum减一
    if (
      commentParams.pageNum * commentParams.pageSize - 1 <=
      +commentTotal.value
    ) {
      if (commentParams.pageNum !== 1) {
        commentParams.pageNum--;
      }
    }
    getManageMessageListAPI();
  }
};
</script>

<template>
  <div class="manage-message-box">
    <el-card shadow="hover">
      <el-scrollbar>
        <div class="flex between pb5">
          <div class="shrink0">
            <el-input
              class="w-50 m-2"
              placeholder="请输入留言内容"
              :prefix-icon="Search"
              v-model="searchInput"
              @blur="commentChange"
            />
          </div>
          <div class="shrink0 ml10">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="刷新"
              placement="top"
            >
              <el-button color="#40485b" @click="getManageMessageListAPI"
                ><i class="iconfont">&#xe631;</i></el-button
              >
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="我要留言"
              placement="top"
            >
              <el-button
                @click="dialogController = true"
                :color="theme.theme.list[theme.themeIndex].primary"
              >
                <el-space wrap>
                  <i
                    class="iconfont"
                    :style="{
                      color: theme.theme.list[theme.themeIndex].text,
                    }"
                    >&#xe743;</i
                  >
                </el-space>
                <span
                  :style="{
                    color: theme.theme.list[theme.themeIndex].text,
                  }"
                  >留言</span
                >
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
    <div class="mt20 text-seconed caps mb20">
      <p class="text-seconed">欢迎点击右上角留言按钮进行留言!</p>
      共有<span class="text-primary fz24">{{ commentTotal }}</span
      >条留言
    </div>
    <WComment
      v-for="item in manageMessageList"
      :key="item.messageId"
      :comment="item"
      @reply="submitReplyMessage"
      @like="submitLikeMessages"
      @modify="submitModifyMessages"
      @oppose="submitOpposeMessages"
      @delete="submitDeleteMessages"
    >
    </WComment>
    <div class="flex end mt10">
      <el-pagination
        small
        background
        layout="prev, pager, next"
        v-model:page-size="commentParams.pageSize"
        v-model:current-page="commentParams.pageNum"
        :total="parseInt(commentTotal)"
        class="mt-4"
      />
    </div>
    <el-dialog
      v-model="dialogController"
      :title="
        dialogController && dialogData.messageId ? '编辑评论' : '添加评论'
      "
      :close-on-click-modal="false"
      @close="closeDialog"
      width="40%"
    >
      <el-form
        :model="dialogData"
        :rules="messageRules"
        ref="messageFormDom"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="留言内容" prop="content">
          <el-input
            type="textarea"
            placeholder="请输入评论内容"
            v-model="dialogData.content"
            :rows="4"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="submitCreateComment"
            :style="{
              color: theme.theme.list[theme.themeIndex].text,
            }"
            :color="theme.theme.list[theme.themeIndex].primary"
            >保存</el-button
          >
          <div class="cancle-btn ml20">
            <el-button @click="closeDialog">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
:deep(.el-pager li:hover) {
  color: $primary;
}
</style>
