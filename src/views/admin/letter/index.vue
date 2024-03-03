<script lang="ts" setup>
import "@/styles/index.scss";
import { getLetterList } from "@/api/letter.ts";
import { letterListType } from "@/types/letter.ts";
import { ref, Ref, watch } from "vue";
import { themeSetting } from "@/store/theme";
import { Search } from "@element-plus/icons-vue";
import dayjs from "dayjs";

const theme = themeSetting();

const letterList = ref([]);

const total = ref();

const letterListParams: Ref<letterListType> = ref({
  pageNum: 1,
  pageSize: 0,
  email: "",
});

const getLetterListAPI = async () => {
  const res = await getLetterList(letterListParams.value);
  letterList.value = res.data.data.data;
  total.value = res.data.data.count;
  console.log(letterList.value);
};

const refreshArticleList = () => {};

const getLetterDeatil = (row: any) => {
  console.log(row);
};

watch(
  () => letterListParams.value.pageNum,
  () => {
    getLetterListAPI();
  },
  { immediate: true }
);
</script>

<template>
  <div class="letter-box flex">
    <div class="letter-list mr20">
      <el-card class="card-box" shadow="hover">
        <el-scrollbar>
          <div class="flex start pb5">
            <div class="shrink0 ml10">
              <el-input
                class="w-50 m-2"
                placeholder="请输入用户邮箱"
                :prefix-icon="Search"
                v-model="letterListParams.email"
              />
            </div>
            <div class="shrink0 ml10">
              <el-button
                :style="{
                  color: theme.theme.list[theme.themeIndex].text,
                }"
                :color="theme.theme.list[theme.themeIndex].primary"
                @click="getLetterListAPI"
                >查询</el-button
              >
            </div>
            <div class="shrink0 cancle-btn ml10">
              <el-button @click="refreshArticleList">重置</el-button>
            </div>
          </div>
        </el-scrollbar>
        <div class="letter-table mt10">
          <el-table
            height="710"
            border
            :data="letterList"
            style="width: 100%"
            :header-cell-style="{
              color: `${theme.theme.list[theme.themeIndex].text}`,
              background: `${theme.theme.list[theme.themeIndex].primary}`,
              height: '60px',
            }"
            :row-style="{ height: '65px' }"
          >
            <template #empty>
              <div></div>
              <img
                style="width: 400px; height: 400px"
                src="../../../assets/imgs/noPermission.png"
                fit="cover"
              />
            </template>
            <el-table-column
              min-width="200"
              align="center"
              prop="email"
              label="私信邮箱"
            />
            <el-table-column
              min-width="200"
              align="center"
              prop="content"
              :show-overflow-tooltip="true"
              label="私信内容"
            />
            <el-table-column
              min-width="100"
              align="center"
              prop="isRead"
              label="是否阅读"
            >
              <template #default="{ row }">
                <el-tag :type="row.isRead ? 'primary' : 'danger'">{{
                  row.isRead ? "已读" : "未读"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100"
              align="center"
              prop="remark"
              label="是否回复"
            >
              <template #default="{ row }">
                <el-tag :type="row.isReply ? 'primary' : 'danger'">{{
                  row.isReply ? "已回复" : "未回复"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              min-width="200"
              align="center"
              prop="createdAt"
              label="创建时间"
            >
              <template #default="{ row }">
                {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column
              prop="action"
              fixed="right"
              label="操作"
              min-width="200"
              align="center"
            >
              <template #default="{ row }">
                <el-button
                  @click="getLetterDeatil(row)"
                  auto-insert-space
                  type="success"
                  link
                  >查看详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <div class="letter-detail">
      <el-card class="card-box" shadow="hover"> </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.letter-box {
  .letter-list {
    height: 100%;
    width: 60%;
    .letter-table {
      width: 100%;
      background-color: #fff;
    }
  }
  .letter-detail {
    width: calc(40% - 20px);
  }
}
</style>
