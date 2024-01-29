<script lang="ts" setup>
import { getBlogArticleList } from "api/blog.ts";
import { ref, onMounted, watch, Ref, reactive } from "vue";
import { blogArticleType } from "@/types/blog";

let blogArticleParams: blogArticleType = reactive({
  pageNum: 1,
  pageSize: 10,
  title: "",
  columnKey: "",
  sortOrder: 0,
  recommended: 0,
  category: 0,
});

let blogArticleList = ref([]);

watch(
  blogArticleParams,
  async () => {
    const res = await getBlogArticleList(blogArticleParams);
    console.log(res);
    blogArticleList.value = res.data.data.data;
  },
  { immediate: true, deep: true }
);

onMounted(() => {});
</script>

<template>
  <div>博文管理</div>
</template>

<style lang="scss" scoped></style>
