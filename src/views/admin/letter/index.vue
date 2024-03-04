<script lang="ts" setup>
import "@/styles/index.scss";
import { getLetterList, replyLetter, updateLetter } from "@/api/letter.ts";
import { letterListType, letterType } from "@/types/letter.ts";
import { ref, Ref, watch } from "vue";
import { themeSetting } from "@/store/theme";
import { Search } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { WNotification } from "@/utils/toast";

const theme = themeSetting();

const letterList: Ref<Array<letterType>> = ref([]);

const total = ref();

const letterContent = ref({
  id: "",
  email: "",
  isReply: 0,
  isRead: 0,
  content: "",
  createdAt: "",
  replyContent: "",
});

const letterListParams: Ref<letterListType> = ref({
  pageNum: 1,
  pageSize: 10,
  email: "",
});

// 私信展示索引
const letterDetailIndex = ref();

const getLetterListAPI = async () => {
  const res = await getLetterList(letterListParams.value);
  letterList.value = res.data.data.data;
  total.value = res.data.data.count;
};

const refreshArticleList = () => {};

// 获取私信详情
const getLetterDeatil = async (scope: any) => {
  letterContent.value = scope.row;
  letterDetailIndex.value = scope.$index;
  letterList.value[letterDetailIndex.value].isRead = 1;
  // 更新私信是否阅读状态
  updateLetter({ id: scope.row.id, isRead: 1 });
};

// 回复输入框
const replyInput = ref("");

// 提交私信回复
const btnOk = async () => {
  if (replyInput.value.length === 0) {
    WNotification.error("回复内容不能为空");
    return;
  }
  const res = await replyLetter({
    id: letterContent.value.id,
    replyContent: replyInput.value,
    email: letterContent.value.email,
  });
  if (res.data.status) {
    WNotification.success("私信回复成功");
    letterContent.value.replyContent = replyInput.value;
    letterList.value[letterDetailIndex.value].isReply = 1;
    replyInput.value = "";
  }
};

// 回复私信取消按钮
const cancleBtn = () => {
  replyInput.value = "";
  letterContent.value = {
    id: "",
    email: "",
    isReply: 0,
    isRead: 0,
    content: "",
    createdAt: "",
    replyContent: "",
  };
};

// 删除私信
const deleteLetter = async (row: any) => {
  const res = await updateLetter({ id: row.id, status: 0 });
  console.log(res);
  let { pageNum, pageSize } = letterListParams.value;
  if (res.data.status) {
    if ((pageNum - 1) * pageSize >= total.value - 1) {
      if (pageNum !== 1) {
        return letterListParams.value.pageNum--;
      }
    }
    getLetterListAPI();
  }
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
  <div class="letter-box">
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
        <div class="mt10">
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
                <el-tag :type="row.isRead ? 'success' : 'danger'">{{
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
                <el-tag :type="row.isReply ? 'success' : 'danger'">{{
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
              <template #default="scope">
                <el-button
                  @click="getLetterDeatil(scope)"
                  auto-insert-space
                  type="success"
                  link
                  >查看详情</el-button
                >
                <el-popconfirm
                  @confirm="deleteLetter(scope.row)"
                  title="请确认是否删除私信?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                >
                  <template #reference>
                    <el-button auto-insert-space type="danger" link
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex end mt10">
          <el-pagination
            small
            background
            hide-on-single-page
            layout="prev, pager, next"
            v-model:page-size="letterListParams.pageSize"
            v-model:current-page="letterListParams.pageNum"
            :total="total"
            class="mt-4"
          />
        </div>
      </el-card>
    </div>
    <div class="letter-detail">
      <el-card class="card-box" shadow="hover">
        <div class="pb20">
          <i class="iconfont mr10">&#xe63e;</i>
          <span class="fz16">私信详情</span>
        </div>
        <el-descriptions>
          <el-descriptions-item label="私信邮箱">{{
            letterContent.email
          }}</el-descriptions-item>
          <el-descriptions-item label="是否回复">
            <el-tag :type="letterContent.isReply ? 'success' : 'danger'"
              >{{ letterContent.isReply ? "已回复" : "未回复" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="私信时间">
            {{ dayjs(letterContent.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
          </el-descriptions-item>
          <el-descriptions-item :span="3" label="私信内容">
            {{ letterContent.content }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="letterContent.replyContent"
            :span="3"
            label="回复内容"
          >
            {{ letterContent.replyContent }}
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="!letterContent.replyContent" class="reply-letter-box mt20">
          <el-input
            v-model="replyInput"
            :rows="6"
            type="textarea"
            placeholder="回复"
            :show-word-limit="true"
          />
          <div v-if="letterContent.email" class="btn-list mt20 flex jcenter">
            <el-button
              @click="btnOk"
              :color="theme.theme.list[theme.themeIndex].primary"
            >
              <span :style="{ color: theme.theme.list[theme.themeIndex].text }">
                确认回复
              </span>
            </el-button>
            <div class="cancle-btn ml20">
              <el-button @click="cancleBtn">取消</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.letter-box {
  display: flex;
  .letter-list {
    width: 60%;
  }
  .letter-detail {
    width: calc(40% - 20px);
    height: 100%;
    .card-box {
      height: 100%;
      .reply-letter-box {
      }
    }
  }
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
:deep(.el-pager li:hover) {
  color: $primary;
}
:deep(.el-textarea__inner) {
  box-shadow: 0 0 90px #00000026;
  -webkit-box-shadow: 0 0 90px rgba(0, 0, 0, 0.15);
}
</style>
