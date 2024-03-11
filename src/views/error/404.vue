<template>
  <div>
    <section class="error-page">
      <div class="info">
        <img class="error-img-size" src="../../../public/404.png" />
        <h2 class="error-title">404 ERROR</h2>
        <p>您所访问的页面不存在，它或已被移动，删除或者重命名。</p>
        <p>请访问其他页面</p>
        <nav>
          <RouterLink :to="{ path: '/', replace: true }"
            >Back To Home</RouterLink
          >
        </nav>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="scss" scoped>
.error-page {
  background: $main;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh);
  box-sizing: border-box;
  text-align: center;
  .error-img-size {
    width: 40rem;
  }
  .error-title {
    color: $seconed;
    font-size: 2.1875rem;
    padding-bottom: 0.1875rem;
    font-weight: bold;
  }

  p {
    color: $seconed;
    font-size: 0.8125rem;
    padding: 0.3125rem 0;
  }

  // img {
  //   width: 25rem;
  // }
}
</style>
