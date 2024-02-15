<script lang="ts" setup>
import { reactive, ref, watch, onMounted, Ref } from "vue";
import "@/styles/index.scss";
import { Search } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme";
import {
  getBlogCommentList,
  updateBlogCommentLikeOrOppose,
  getArticleSelectList,
  newCreateComment,
  updateComment,
} from "@/api/blog.ts";
import { getArticleCommentType } from "@/types/blog.ts";
import WComment from "@/components/WComment.vue";
import { setCookie } from "@/utils/cookies.ts";
import { articleSelect } from "@/types/blog.ts";
import { WNotification } from "@/utils/toast";

const theme = themeSetting();
// 搜索博客评论参数
const commentParams: getArticleCommentType = reactive({
  pageNum: 1,
  pageSize: 10,
  comment: "",
});
// 搜索栏值
const searchInput = ref();

const commentTotal = ref();

const commentList: any = ref([]);

// 获取文章评论列表
const getBlogCommentListAPI = async () => {
  const res = await getBlogCommentList(commentParams);
  commentTotal.value = res.data.data.count;
  commentList.value = res.data.data.data;
  console.log(commentList.value);
};

watch(
  () => commentParams,
  () => {
    getBlogCommentListAPI();
  },
  { immediate: true, deep: true }
);
// 输入框值改变
const commentChange = () => {
  commentParams.comment = searchInput.value;
  console.log(commentParams);
};
// 提交点赞消息
const submitLikeMessages = (id: string) => {
  updateBlogCommentLikeOrOppose({ id, likeOrOppose: "like" }).then((res) => {
    if (res.data.status) {
      setCookie(`comment-like-${id}`, true, 30);
      getBlogCommentListAPI();
    }
  });
};
// 提交反对消息
const submitOpposeMessages = (id: string) => {
  updateBlogCommentLikeOrOppose({ id, likeOrOppose: "Oppose" }).then((res) => {
    if (res.data.status) {
      setCookie(`comment-oppose-${id}`, true, 30);
      getBlogCommentListAPI();
    }
  });
};

const submitReplyMessages = () => {};

// 修改评论
const submitModifyMessages = (message: any) => {
  console.log(message);
  // dialogData.value.relatedArticleId = message.articleInfo.id;
  dialogData.value.content = message.content;
  dialogData.value.messageId = message.messageId;
  dialogController.value = true;
};

// 弹层控制
const dialogController = ref(false);

// 修改和新建评论的表单
const dialogData = ref({
  relatedArticleId: "",
  messageId: "",
  content: "",
});

// 修改和新建评论的规则
const messageRules = reactive({
  relatedArticleId: [
    { required: true, message: "请选择文章", trigger: "blur" },
  ],
  content: [{ required: true, message: "评论内容不能为空", trigger: "blur" }],
});

// 关闭弹层
const closeDialog = () => {
  dialogController.value = false;
  dialogData.value = {
    relatedArticleId: "",
    messageId: "",
    content: "",
  };
  messageFormDom.value.resetFields();
};

// 弹层表单DOM
const messageFormDom = ref();

// 文章下拉列表
const articleSelectList: Ref<Array<articleSelect>> = ref([]);
// 获取文章下拉列表
const getArticleSelectListAPI = async () => {
  const res = await getArticleSelectList();
  articleSelectList.value = res.data.data;
};

// 新增文章评论或留言
const submitCreateComment = async () => {
  if (!dialogData.value.messageId) {
    // 新增留言或评论
    const res = await newCreateComment(dialogData.value);

    if (res.data.status) {
      WNotification.success(res.data.message);
      getBlogCommentListAPI();
    }
  } else {
    // 修改留言或评论
    const res = await updateComment(dialogData.value);
    console.log(res);
    if (res.data.status) {
      WNotification.success(res.data.message);
      getBlogCommentListAPI();
    }
  }
  closeDialog();
};

onMounted(() => {
  getArticleSelectListAPI();
});
</script>

<template>
  <div class="comment-box">
    <el-card shadow="hover">
      <el-scrollbar>
        <div class="flex between pb5">
          <div class="shrink0">
            <el-input
              class="w-50 m-2"
              placeholder="请输入评论内容"
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
              <el-button color="#40485b"
                ><i class="iconfont">&#xe631;</i></el-button
              >
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="新增博文"
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
                    >&#xe620;</i
                  >
                </el-space>
                <span
                  :style="{
                    color: theme.theme.list[theme.themeIndex].text,
                  }"
                  >新增</span
                >
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
    <div class="mt20 text-seconed caps mb20">
      共有<span class="text-primary fz24">{{ commentTotal }}</span
      >条评论
    </div>
    <WComment
      v-for="item in commentList"
      :key="item.messageId"
      :comment="item"
      @like="submitLikeMessages"
      @oppose="submitOpposeMessages"
      @reply="submitReplyMessages"
      @modify="submitModifyMessages"
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
            :row="3"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="文章" prop="relatedArticleId">
          <el-select
            clearable
            v-model="dialogData.relatedArticleId"
            placeholder="请选择文章"
          >
            <el-option
              v-for="item in articleSelectList"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
.cancle-btn {
  .el-button:hover {
    color: $primary;
    border-color: $primary;
    background-color: #ffffff;
  }
  .el-button:focus {
    color: $primary;
    border-color: $primary;
    background-color: #ffffff;
  }
}
</style>
