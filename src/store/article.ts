import { ref, Ref } from "vue";
import { defineStore } from "pinia";
import { updateArticleType } from "@/types/blog.ts";
import { uploadFile } from "@/api/common.ts";
import { WMessage } from "@/utils/toast";

export const useArticleStore = defineStore("article", () => {
  const isWriteArticle: Ref<boolean> = ref(false);
  // 是否允许点击保存按钮
  const isAllowSave: Ref<boolean> = ref(false);

  // 编辑文章的数据
  const editArticleData: Ref<updateArticleType> = ref({
    id: "",
    title: "",
    cover: "http://www.maixf.top:4089/uploads/images/defaultCover.png",
    abstract: "",
    content: "",
    remark: "",
    category: 1,
    isReship: 2,
    isReshipUrl: "",
    isReshipName: "",
    recommended: 0,
    status: 2,
  });
  // 退出时,清理数据
  const clearArticleData = () => {
    editArticleData.value = {
      id: "",
      title: "",
      cover: "http://www.maixf.top:4089/uploads/images/defaultCover.png",
      abstract: "",
      content: "",
      remark: "",
      category: 1,
      isReship: 2,
      isReshipUrl: "",
      isReshipName: "",
      recommended: 0,
      status: 2,
    };
  };

  // 图片预览列表
  const imagesPreviewList = ref([]);
  // 默认图片预览列表
  const defaultImagesPreviewList = ref([
    "http://www.maixf.top:4089/uploads/images/defaultCover.png",
  ]);

  // 匹配相同键名元素并赋值
  const setEditArticleData = (editArticle: any, responseData: any) => {
    Object.keys(editArticle).forEach((key) => {
      if (responseData.hasOwnProperty(key)) {
        console.log((editArticleData.value as any)[key]);
        (editArticleData.value as any)[key] = responseData[key];
      }
    });
  };
  // 上传图片
  const onUploadImg = async (event: any, insertImage: any, files: any) => {
    const res = await Promise.all(
      files.map((file: any) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append("file", file);
          uploadFile(form)
            .then((res: any) => {
              rev(res.data.data);
            })
            .catch((err) => {
              rej(err);
            });
        });
      })
    );
    res.map((item) => {
      return insertImage({
        url: item.fileUrl,
        desc: item.fileName,
      });
    });
  };

  let rules = {
    title: [
      { required: true, message: "请输入标题", trigger: "blur" },
      { min: 2, max: 100, message: "长度在 2 到 50 个字符", trigger: "blur" },
    ],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }],
    category: [{ required: true, message: "请选择文章分类", trigger: "blur" }],
  };

  return {
    isAllowSave,
    isWriteArticle,
    editArticleData,
    imagesPreviewList,
    defaultImagesPreviewList,
    rules,
    clearArticleData,
    setEditArticleData,
    onUploadImg,
  };
});
