<script setup lang="ts">
import "@/styles/index.scss";
import dayjs from "dayjs";
import { reactive } from "vue";
import { getCookie } from "@/utils/cookies.ts";
const props = defineProps({
  comment: {
    type: Object,
    required: true,
    default: () => [],
  },
});

const state = reactive({
  show: {
    replies: false,
  },
  likeActive: (messageId: string) => getCookie(`comment-like-${messageId}`),
  opposeActive: (messageId: string) => getCookie(`comment-oppose-${messageId}`),
});

const emits = defineEmits(["modify", "like", "oppose"]);
// 喜欢
const likeComment = (id: string) => {
  if (state.likeActive(id)) return;
  emits("like", id);
};
// 反对
const opposeComment = (id: string) => {
  if (state.opposeActive(id)) return;
  emits("oppose", id);
};
// 修改留言
const modifyMessage = (message: any) => {
  emits("modify", message);
};
</script>

<template>
  <el-card class="mb20">
    <div class="article-name">
      文章:<span class="fz16 text-primary ml5"
        >《{{ props.comment.articleInfo.title }}》</span
      >
    </div>
    <div class="comment-inner">
      <div class="comment-inner-avatar mr10">
        <el-avatar :src="props.comment.userInfo.avatar" />
      </div>
      <div class="comment-inner-content fz14 por">
        <div class="comment-content-author warp column start">
          <div class="comment-content-author-name textColor fw700 fz14 lh1 mb5">
            {{ props.comment.userInfo.nickname }}
          </div>
          <div class="fz12 textColor">
            在{{
              dayjs(props.comment.userInfo.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            }}说
          </div>
        </div>
        <div>
          {{ props.comment.content }}
        </div>
        <div class="comment-actions mt20">
          <span class="mr10">
            来自: {{ props.comment.userInfo.userIp || "未知" }}
          </span>
          <span class="mr10">
            城市: {{ props.comment.userInfo.address || "未知" }}</span
          >
          <span class="mr10">
            操作平台: {{ props.comment.userInfo.platform || "未知" }}</span
          >
          <span
            :class="{ active: state.likeActive(props.comment.messageId) }"
            @click="likeComment(props.comment.messageId)"
          >
            赞同({{ props.comment.likeNum || 0 }})
          </span>
          <span
            :class="{ active: state.opposeActive(props.comment.messageId) }"
            @click="opposeComment(props.comment.messageId)"
          >
            反对({{ props.comment.opposeNum || 0 }})
          </span>
          <span @click="modifyMessage(props.comment)"> 修改 </span>
          <span> 删除 </span>
        </div>
      </div>
    </div>
    <div class="comment-nested">
      <div
        class="reply-box mb20"
        v-for="item in props.comment.replyInfo"
        :key="item.messageId"
      >
        <div class="comment-inner-avatar mr10">
          <el-avatar :src="item.userInfo.avatar" />
        </div>
        <div class="comment-inner-content fz14 por">
          <div class="comment-content-author warp column start">
            <span class="textColor fw700 fz14 lh1 mb5">
              {{ item.userInfo.nickname }}@{{ item.toUserInfo.nickname }}
            </span>
            <div class="fz12 textColor">
              在{{ dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss") }}说
            </div>
          </div>
          <div>
            {{ item.content }}
          </div>
          <div class="comment-actions mt10">
            <span class="mr10">
              来自: {{ item.userInfo.userIp || "未知" }}
            </span>
            <span class="mr10">
              城市: {{ item.userInfo.address || "未知" }}</span
            >
            <span class="mr10">
              操作平台: {{ item.userInfo.platform || "未知" }}</span
            >
            <span
              :class="{ active: state.likeActive(item.messageId) }"
              @click="likeComment(item.messageId)"
            >
              赞同({{ item.likeNum || 0 }})
            </span>
            <span
              :class="{ active: state.opposeActive(item.messageId) }"
              @click="opposeComment(item.messageId)"
            >
              反对({{ item.opposeNum || 0 }})
            </span>
            <span @click="modifyMessage(item)"> 修改 </span>
            <span> 删除 </span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.comment-inner {
  display: flex;
  padding: 16px 0;
}
.comment-inner-content {
  word-wrap: break-word;
  flex: 1 1 auto;
  min-width: 1px;
}
.comment-content-author {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 4px;
}
.textColor {
  color: #00000073;
}
.comment-actions > span {
  color: #00000073;
  cursor: pointer;
  font-size: 12px;
  margin-right: 10px;
  transition: color 0.3s;
  &:hover {
    color: #595959;
  }
}
.active {
  color: $primary !important;
}
.comment-nested {
  margin-left: 50px;
  .reply-box {
    display: flex;
  }
}
</style>
