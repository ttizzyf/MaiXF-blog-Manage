<script lang="ts" setup>
import WmdEdit from "@/components/WmdEdit.vue";
import "@/styles/index.scss";
import { useArticleStore } from "@/store/article.ts";
import { themeSetting } from "@/store/theme.ts";
import { ref } from "vue";
import storage from "@/utils/storage";
import { WNotification } from "@/utils/toast";

const headers = {
  authorization: storage.get("userInfo").token,
};

const theme = themeSetting();

const articleStore = useArticleStore();

// 文章类型
let categoryList = ref([
  { label: "技术", value: 1 },
  { label: "生活", value: 2 },
  { label: "其他", value: 3 },
]);

// 上传md文件并解析
const handleMDSuccess = (file: any) => {
  articleStore.editArticleData.content = file.data.fileData;
  articleStore.editArticleData.title = file.data.fileName;
  articleStore.editArticleData.abstract = file.data.plainTextExcerpt;
};

// 上传md文件失败
const handleMDError = () => {
  WNotification.error("md文件上传失败");
};

// 上传封面成功
const uploadCoverSuccess = (file: any) => {
  articleStore.editArticleData.cover = file.data.fileUrl;
  articleStore.imagesPreviewList.splice(0, 1);
  articleStore.imagesPreviewList.push(file.data.fileUrl as never);
};

// 上传封面失败
const uploadCoverError = () => {
  WNotification.error("上传封面失败");
};

const isShowDialog = ref(false);

const confirmExit = () => {
  articleStore.clearArticleData();
  articleStore.imagesPreviewList = [];
  articleStore.isWriteArticle = false;
  isShowDialog.value = false;
};
</script>

<template>
  <div>
    <div class="flex mb20">
      <i @click="isShowDialog = true" class="iconfont fz24 fw700 mr10 pointer"
        >&#xe677;</i
      >
      <span class="fz18 fw700 caps">{{
        articleStore.editArticleData.id ? "编辑博文" : "创建博文"
      }}</span>
    </div>
    <el-form
      :model="articleStore.editArticleData"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="标题:">
        <el-input
          style="width: 50%"
          type="text"
          placeholder="请输入标题"
          v-model="articleStore.editArticleData.title"
          maxlength="20"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="内容:">
        <div class="w100">
          <WmdEdit></WmdEdit>
          <el-upload
            class="mt20"
            :headers="headers"
            @success="handleMDSuccess"
            @error="handleMDError"
            :show-file-list="false"
            action="/w1/w1/blog/blog_article/uploadArticleMd"
          >
            <el-button :color="theme.theme.list[theme.themeIndex].primary">
              <span
                :style="{
                  color: theme.theme.list[theme.themeIndex].text,
                }"
                >上传文件md文件</span
              ></el-button
            >
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="封面:">
        <div class="w100">
          <el-image
            style="height: 200px"
            :max-scale="7"
            :min-scale="2"
            :src="articleStore.editArticleData.cover"
            :preview-src-list="articleStore.imagesPreviewList"
            :initial-index="0"
            fit="cover"
          />
        </div>
        <el-upload
          class="mt20"
          :headers="headers"
          accept=".jpg,.jpeg,.png,.image"
          @success="uploadCoverSuccess"
          @error="uploadCoverError"
          :show-file-list="false"
          :limit="1"
          :multiple="false"
          action="/w1/w1/common/upload"
        >
          <el-button :color="theme.theme.list[theme.themeIndex].primary">
            <span
              :style="{
                color: theme.theme.list[theme.themeIndex].text,
              }"
              >上传封面</span
            ></el-button
          >
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要:">
        <el-input
          type="textarea"
          style="width: 50%"
          :rows="3"
          v-model="articleStore.editArticleData.abstract"
          placeholder="请输入文章摘要"
          clearable
          maxlength="300"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input
          type="textarea"
          style="width: 50%"
          :rows="1"
          v-model="articleStore.editArticleData.remark"
          placeholder="请输入文章备注"
          clearable
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类:">
        <el-select
          v-model="articleStore.editArticleData.category"
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
      </el-form-item>
      <el-form-item>
        <el-space>
          <div class="flex mr20">
            <span class="mr10 fz12">立即发布:</span>
            <el-switch
              v-model="articleStore.editArticleData.status"
              class="ml-2"
              inline-prompt
              :active-value="1"
              :inactive-value="2"
              :active-color="theme.theme.list[theme.themeIndex].primary"
              :inactive-color="theme.theme.list[theme.themeIndex].bg"
              active-text="发布"
              inactive-text="草稿"
            />
          </div>
          <div class="flex mr20">
            <span class="mr10 fz12">是否精选:</span>
            <el-switch
              v-model="articleStore.editArticleData.recommended"
              class="ml-2"
              inline-prompt
              :active-value="0"
              :inactive-value="1"
              :active-color="theme.theme.list[theme.themeIndex].primary"
              :inactive-color="theme.theme.list[theme.themeIndex].bg"
              active-text="是"
              inactive-text="否"
            />
          </div>
          <div class="flex mr20">
            <span class="mr10 fz12">是否原创:</span>
            <el-switch
              v-model="articleStore.editArticleData.isReship"
              class="ml-2"
              inline-prompt
              :active-value="2"
              :inactive-value="1"
              :active-color="theme.theme.list[theme.themeIndex].primary"
              :inactive-color="theme.theme.list[theme.themeIndex].bg"
              active-text="是"
              inactive-text="否"
            />
          </div>
        </el-space>
      </el-form-item>
      <el-form-item
        v-if="articleStore.editArticleData.isReship === 2"
        label="转载:"
      >
        <div class="w100">
          <el-input
            style="width: 50%"
            v-model="articleStore.editArticleData.isReshipUrl"
            placeholder="请输入转载地址"
          ></el-input>
        </div>

        <el-input
          class="mt20"
          style="width: 50%"
          v-model="articleStore.editArticleData.isReshipName"
          placeholder="请输入转载文章名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-divider class="mt20" />
    <div class="flex jcenter">
      <el-button :color="theme.theme.list[theme.themeIndex].primary"
        ><span
          :style="{
            color: theme.theme.list[theme.themeIndex].text,
          }"
          >保存</span
        ></el-button
      >
      <div class="cancle-btn ml20">
        <el-button @click="isShowDialog = true">取消</el-button>
      </div>
    </div>
    <el-dialog
      style="width: 30%"
      :model-value="isShowDialog"
      @close="isShowDialog = false"
    >
      <template #header>
        <div class="flex h32">
          <i class="iconfont fz24 mr10 text-primary">&#xe622;</i
          ><span class="text-primary">提示</span>
        </div>
      </template>
      博文数据暂未保存,请确认是否关闭退出
      <template #footer>
        <div class="flex end">
          <el-button :color="theme.theme.list[theme.themeIndex].primary">
            <span
              :style="{
                color: theme.theme.list[theme.themeIndex].text,
              }"
              @click="confirmExit"
              >确认</span
            >
          </el-button>
          <el-button @click="isShowDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.cancle-btn {
  .el-button:hover {
    color: $primary;
    border-color: $primary;
    background-color: #ffffff;
  }
}
</style>
