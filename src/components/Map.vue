<template>
  <div class="map__wrapper">
    <div id="map__box" class="map"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MyMap from "@/Map";
import { mapState, mapGetters } from "vuex";
import { TMapState } from "@/types";
import { State } from "@/store";

@Options({
  map: null,
  marker: null,

  props: {
    isPlay: Boolean,
    chosenSpeed: Number,
  },
  computed: {
    ...mapState<any, TMapState<State>>({
      coordinates: (state: State) => state.coordinates,
      position: (state: State) => state.position,
      isLoading: (state: State) => state.isLoading,
      stepCounter: (state: State) => state.stepCounter,
    }),
    ...mapGetters({
      maxSteps: "maxSteps",
    }),
  },
  methods: {
    move() {
      if (this.isPlay) this.$store.commit("nextStep");
    },
  },

  mounted() {
    this.myMap = new MyMap("map__box");

    this.myMap.onLoad(() => {
      this.myMap.createLine("trace", "#888", 0.4, 8);
      this.myMap.createLine("plume", "#093", 1, 6);

      this.$store.dispatch("getCoordinates");
    });
  },

  watch: {
    isLoading(newValue: boolean) {
      if (!newValue) {
        this.myMap.setCoordinatesToLine("trace", this.coordinates);
        this.myMap.setCoordinatesToLine(
          "plume",
          this.coordinates.slice(0, this.stepCounter)
        );

        this.myMap.setCoordinateToMarker(this.position);
      }
    },
    isPlay(newValue) {
      if (newValue) this.move();
    },
    stepCounter() {
      if (this.stepCounter > 0) {
        this.myMap.moveToPointWithPlume(
          "plume",
          this.coordinates.slice(0, this.stepCounter),
          this.position,
          this.chosenSpeed * 10,
          () => this.move()
        );
      }
    },
  },
})
export default class MapBox extends Vue {
  markerEl!: HTMLElement;
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}

.map__wrapper {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 0px 20px 0px #000000ad;
  z-index: 999;
}
</style>
