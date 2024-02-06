<script lang="ts" setup>
import {
  getBlogArticleList,
  updateArticle,
  getArticleDetails,
  deleteArticle,
} from "api/blog.ts";
import { ref, onMounted, watch, reactive, Ref } from "vue";
import { blogArticleType, blogParamType } from "@/types/blog";
import { themeSetting } from "@/store/theme";
import { Search } from "@element-plus/icons-vue";
import { WMessage } from "@/utils/toast";
import writeOrEditArticle from "../writeOrEditArticle/index.vue";
import { useArticleStore } from "@/store/article.ts";
import "@/styles/index.scss";
import dayjs from "dayjs";

const articleStore = useArticleStore();

const theme = themeSetting();

let blogArticleParams: blogArticleType = reactive({
  pageNum: 1,
  pageSize: 10,
  title: "",
  category: "",
  recommended: "",
  isReship: "",
});

let blogArticleList: Ref<Array<blogParamType>> = ref([]);

const blogArticleTotal = ref("");
// 文章类型
let categoryList = ref([
  { label: "技术", value: 1 },
  { label: "生活", value: 2 },
  { label: "其他", value: 3 },
]);
// 是否精选
const recommendedList = ref([
  { label: "普通", value: 0 },
  { label: "精选", value: 1 },
]);
// 是否转载
let isReshipList = ref([
  { label: "转载", value: 1 },
  { label: "原创", value: 2 },
]);
// 获取文章列表
const getBlogArticleListAPI = async () => {
  let blogParams = blogArticleParams;
  if (!blogParams.category) blogParams.category = "";
  const res = await getBlogArticleList(blogParams);
  blogArticleList.value = res.data.data.data;
  console.log(blogArticleList.value);
  blogArticleTotal.value = res.data.data.count;
};

watch(
  blogArticleParams,
  async () => {
    getBlogArticleListAPI();
  },
  { immediate: true, deep: true }
);

// 编辑文章
const editArticle = async (id: string) => {
  articleStore.isWriteArticle = true;
  articleStore.editArticleData.id = id;
  const res = await getArticleDetails({ id });
  console.log(res.data.data);
  articleStore.setEditArticleData(articleStore.editArticleData, res.data.data);
  articleStore.imagesPreviewList.push(res.data.data.cover as never);
};

// 删除文章
const deleteArticleAPI = async (id: string) => {
  console.log(id);
  const res = await deleteArticle({ id });
  console.log(res);
  if (res.data.status === 1) {
    WMessage.success("删除成功");
    getBlogArticleListAPI();
  } else {
    WMessage.success("删除失败");
  }
};

// 加载状态id
const loadingStatus = ref();

// 修改状态键
const statusKey = ref("");

// 更新博文发布状态
const handleStatusChange = async (scope: any, status: number, key: string) => {
  try {
    loadingStatus.value = scope.row.id;
    statusKey.value = key;
    await updateArticle({ id: scope.row.id, [key]: status });
    setTimeout(() => {
      loadingStatus.value = null;
      statusKey.value = "";
      WMessage.success("状态更新成功");
    }, 1000);
  } catch (err) {
    let objKey;
    if (key === "status" || key === "isReship") {
      objKey = scope.row[key] === 1 ? 2 : 1;
    } else {
      objKey = scope.row[key] === 1 ? 0 : 1;
    }
    blogArticleList.value[scope.$index][key] = objKey;
    loadingStatus.value = null;
    statusKey.value = "";
  }
};

const refreshArticleList = () => {
  blogArticleList.value = [];
  getBlogArticleListAPI();
};

onMounted(() => {});
</script>

<template>
  <div class="article-box">
    <el-card class="card-box" shadow="hover">
      <div class="article-list-show" v-if="!articleStore.isWriteArticle">
        <el-scrollbar>
          <div class="pb10 flex between">
            <div class="shrink0">
              <el-space wrap>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="刷新"
                  placement="top"
                >
                  <el-button @click="refreshArticleList" color="#40485b"
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
                    @click="articleStore.isWriteArticle = true"
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
              </el-space>
            </div>
            <div class="shrink0">
              <el-space wrap>
                <el-input
                  v-model="blogArticleParams.title"
                  class="w-50 m-2"
                  placeholder="通过标题搜索文章"
                  :prefix-icon="Search"
                />
                <el-select
                  v-model="blogArticleParams.category"
                  class="m-2"
                  :clearable="true"
                  placeholder="请选择文章类型"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in categoryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="blogArticleParams.recommended"
                  class="m-2"
                  :clearable="true"
                  placeholder="请选择是否精选"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in recommendedList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-model="blogArticleParams.isReship"
                  class="m-2"
                  :clearable="true"
                  placeholder="请选择是否转载"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in isReshipList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-space>
            </div>
          </div>
        </el-scrollbar>
        <div class="article-box">
          <el-table
            height="700"
            border
            :data="blogArticleList"
            style="width: 100%"
            :header-cell-style="{
              color: `${theme.theme.list[theme.themeIndex].text}`,
              background: `${theme.theme.list[theme.themeIndex].primary}`,
              height: '60px',
            }"
            :row-style="{ height: '30px' }"
          >
            <template #empty>
              <img
                style="width: 400px; height: 400px"
                src="../../../assets/imgs/empty.png"
                fit="cover"
              />
            </template>
            <el-table-column
              min-width="300"
              fixed
              prop="title"
              label="博文名称"
            />
            <el-table-column
              prop="category"
              align="center"
              label="类别"
              width="80"
            >
              <template #default="scope">
                <el-tag
                  :type="
                    scope.row.category === 1
                      ? ''
                      : scope.row.category === 2
                      ? 'success'
                      : 'warning'
                  "
                  disable-transitions
                  >{{
                    scope.row.category === 1
                      ? "技术"
                      : scope.row.category === 2
                      ? "生活"
                      : "其他"
                  }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="cover"
              width="120"
              align="center"
              label="封面"
            >
              <template #default="{ row }">
                <img style="height: 40px" :src="row.cover" fit="cover" />
              </template>
            </el-table-column>
            <el-table-column
              prop="userInfo.nickname"
              label="作者"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="viewNum"
              label="浏览量"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="likeNum"
              label="点赞量"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="status"
              label="发布状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :loading="
                    scope.column.property === statusKey &&
                    scope.row.id === loadingStatus
                  "
                  @change="handleStatusChange(scope, $event, 'status')"
                  class="ml-2"
                  inline-prompt
                  :active-value="1"
                  :inactive-value="2"
                  :active-color="theme.theme.list[theme.themeIndex].primary"
                  :inactive-color="theme.theme.list[theme.themeIndex].bg"
                  active-text="发布"
                  inactive-text="草稿"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="recommended"
              label="是否精选"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.recommended"
                  :loading="
                    scope.column.property === statusKey &&
                    loadingStatus === scope.row.id
                  "
                  @change="handleStatusChange(scope, $event, 'recommended')"
                  class="ml-2"
                  inline-prompt
                  :active-value="1"
                  :inactive-value="0"
                  :active-color="theme.theme.list[theme.themeIndex].primary"
                  :inactive-color="theme.theme.list[theme.themeIndex].bg"
                  active-text="是"
                  inactive-text="否"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="isReship"
              label="是否原创"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isReship"
                  :loading="
                    scope.column.property === statusKey &&
                    loadingStatus === scope.row.id
                  "
                  @change="handleStatusChange(scope, $event, 'isReship')"
                  class="ml-2"
                  inline-prompt
                  :active-value="2"
                  :inactive-value="1"
                  :active-color="theme.theme.list[theme.themeIndex].primary"
                  :inactive-color="theme.theme.list[theme.themeIndex].bg"
                  active-text="是"
                  inactive-text="否"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="createdAt"
              label="创建时间"
              align="center"
              width="200"
            >
              <template #default="{ row }">
                <div>
                  {{ dayjs(row.createdAt).format("YYYY-MM-DD HH-mm-ss") }}
                </div>
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
                <el-button link auto-insert-space @click="editArticle(row.id)">
                  <template #default>
                    <span
                      :style="{
                        color: theme.theme.list[theme.themeIndex].primary,
                      }"
                    >
                      编辑
                    </span>
                  </template>
                </el-button>
                <el-popconfirm
                  @confirm="deleteArticleAPI(row.id)"
                  title="请确认是否博文?"
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
          <div class="flex end mt10">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              v-model:page-size="blogArticleParams.pageSize"
              v-model:current-page="blogArticleParams.pageNum"
              :total="parseInt(blogArticleTotal)"
              class="mt-4"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <writeOrEditArticle></writeOrEditArticle>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.article-box {
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  .table-header {
    background-color: #000000;
  }
  .empty-box {
    height: 500px;
    width: 500px;
    background-color: red;
  }
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: $primary;
  color: $seconed;
}
:deep(.el-pager li:hover) {
  color: $primary;
}
</style>
