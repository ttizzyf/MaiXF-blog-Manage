import { ref, Ref } from "vue";
import { defineStore } from "pinia";
import { updateArticleType } from "@/types/blog.ts";
import { uploadFile } from "@/api/common.ts";

export const useArticleStore = defineStore("article", () => {
  const isWriteArticle: Ref<boolean> = ref(false);

  // 编辑文章的数据
  const editArticleData: Ref<updateArticleType> = ref({
    id: "",
    title: "",
    cover: "",
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
      cover: "http://localhost:4089/uploads/images/defaultCover.png",
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
  const imagesPreviewList = ref([
    "http://localhost:4089/uploads/images/defaultCover.png",
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

  return {
    isWriteArticle,
    editArticleData,
    imagesPreviewList,
    clearArticleData,
    setEditArticleData,
    onUploadImg,
  };
});
