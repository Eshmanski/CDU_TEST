<template>
  <div class="map__box">
    <map-progress></map-progress>
    <Map :isPlay="isPlay" :chosenSpeed="chosenSpeed" />
    <map-controller
      :isPlay="isPlay"
      :speeds="speeds"
      :speedIndex="speedIndex"
      @startPlay="isPlay = true"
      @stopPlay="isPlay = false"
      @setSpeedIndex="(index) => (speedIndex = index)"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Map from "@/components/Map.vue";
import MapProgress from "@/components/MapProgress.vue";
import MapController from "@/components/MapController.vue";
import { mapState } from "vuex";
import { TMapState } from "@/types";
import { State } from "@/store";

@Options({
  components: {
    Map,
    MapProgress,
    MapController,
  },
  data() {
    return {
      isPlay: false,
      speedIndex: 0,
      speeds: [30, 50, 70, 90],
    };
  },
  computed: {
    ...mapState<any, TMapState<State>>({
      isLoading: (state: State) => state.isLoading,
    }),
    chosenSpeed() {
      return this.speeds[this.speedIndex];
    },
  },
})
export default class MapBox extends Vue {
  isPlay!: boolean;
}
</script>

<style scoped>
.map__box {
  position: relative;
  width: 900px;
  height: 550px;
  margin: 100px auto 0;
}
</style>
