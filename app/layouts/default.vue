<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- <div>
    <p>Some default layout content shared across all pages</p>
    <slot />
    xxx
  </div> -->

  <div class="bg-text-silver">
    <header class="text-center mt-3">
      <h1>Todo List</h1>
    </header>

    <slot />

    <hr class="mt-5" >

    <footer class="container">
      <div class="d-flex justify-content-center align-items-center">
        <p class="text-muted font-weight-light">
          ©
          <span>All Rights Reserved</span>
        </p>
      </div>

      <div class="d-flex justify-content-center align-items-center">
        <span class="text-muted font-weight-light">
          <!-- <span class="mr-1"><img src="/img/todo-list.ico" alt="App Icon" width="12" height="12"></span> -->

          Designed and developed by

          <a
            href="https://ivin-dev.com/"
            target="_blank"
            class="text-decoration-none"
            >Ivin Dev</a
          >
        </span
        >
      </div>
    </footer>
  </div>
</template>
