import { ref } from "vue";
import { defineStore } from "pinia";

export const userInfo = defineStore("userInfo", () => {
  const userInfo = ref({
    avatar:
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    nickname: "老八契约",
    email: "1374144742@qq.com",
  });
  return { userInfo };
});
