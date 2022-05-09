<template>
  <MapBox></MapBox>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MapBox from "@/components/MapBox.vue";

@Options({
  data() {
    return {
      msg: "" as string,
    };
  },
  components: {
    MapBox,
  },
})
export default class App extends Vue {
  msg!: string;
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
</style>
