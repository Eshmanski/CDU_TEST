<template>
  <div class="bookmark">
    <div class="box__content">
      <slot class="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class BookMarkButton extends Vue {}
</script>

<style>
.bookmark {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: 50px;
  height: 100px;
  padding: 5px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 0px #000000ad;
}

.box__content {
  display: flex;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: 0 auto 10px;
  background-color: transparent;
}
</style>
