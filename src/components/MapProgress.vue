<template>
  <transition name="progress">
    <div v-if="isLoading" class="map__progress">
      <div class="indicator"></div>
      <div>{{ parceProgress }}%</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import { TMapState } from "@/types";
import { State } from "@/store";

@Options({
  computed: {
    ...mapState<any, TMapState<State>>({
      isLoading: (state: State) => state.isLoading,
      parceProgress: (state: State) => state.parceProgress,
    }),
  },
})
export default class MapProgress extends Vue {
  colorIndicator!: string;
}
</script>

<style>
.map__progress {
  font-size: 20px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  color: rgb(46, 46, 46);
  position: absolute;
  display: flex;
  align-items: center;
  top: 10px;
  left: -120px;
  width: 200px;
  height: 50px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0px 0px 20px 0px #000000ad;
  z-index: 0;
  transform-origin: top right;
}
.indicator {
  width: 15px;
  height: 15px;
  margin-left: 25px;
  margin-right: 15px;
  border-radius: 50%;
  background-color: red;
  border: 3px solid black;
}

.progress-enter-active,
.progress-leave-active {
  transition: transform 0.5s ease-in-out;
}

.progress-enter-from,
.progress-leave-to {
  transform-origin: top right;
  transform: rotate(-90deg);
}

.progress-enter-active .indicator,
.progress-leave-active .indicator {
  transition: background-color 0s step-end;
}

.progress-enter-from .indicator,
.progress-leave-to .indicator {
  background-color: green;
}

.progress-leave-from .indicator,
.progress-enter-to .indicator {
  background-color: red;
}
</style>
