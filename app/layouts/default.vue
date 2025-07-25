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
      <div class="d-flex mb-5 justify-content-end align-items-center">
        <span class="text-muted font-weight-light"
          >Designed and developed by
          <a
            href="mailto:ISCIrving@hotmail.com?subject=Your%20company%20name&body=Your%20information%20contact.%0AName,%20description%20and%20requirements%20of%20the%20project"
            class="text-decoration-none"
            >ISCIrving@hotmail.com</a
          ></span
        >

        <a
          href="https://www.facebook.com/ISCIrving"
          target="_blank"
          class="ml-2 text-decoration-none fab fa-facebook-square fa-2x"
        />
      </div>
    </footer>
  </div>
</template>
