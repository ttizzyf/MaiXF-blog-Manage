<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import "@/styles/index.scss";
import { Search } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme";
import { getBlogCommentList } from "@/api/blog.ts";
import { getArticleCommentType } from "@/types/blog.ts";

const theme = themeSetting();
// 搜索博客评论参数
const commentParams: getArticleCommentType = reactive({
  pageNum: 1,
  pageSize: 10,
  comment: "",
});
// 搜索栏值
const searchInput = ref();

const commentTotal = ref("24");

const commentList = ref([]);

// 获取文章评论列表
const getBlogCommentListAPI = async () => {
  const res = await getBlogCommentList(commentParams);
  console.log(res);
  commentList.value = res.data.data;
};

watch(
  () => commentParams,
  () => {
    getBlogCommentListAPI();
  },
  { immediate: true, deep: true }
);

const commentChange = () => {
  commentParams.comment = searchInput.value;
  console.log(commentParams);
};
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
              <el-button :color="theme.theme.list[theme.themeIndex].primary">
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
    <div class="mt20 text-seconed caps">
      共有<span class="text-primary fz24">24</span>条评论
    </div>
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
