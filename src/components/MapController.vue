<template>
  <transition name="controller">
    <div v-if="!isLoading && !isFirstLoading" class="map__controller">
      <div class="switch_btns">
        <book-mark-card
          class="switch__btn"
          @click="$emit('startPlay')"
          :class="{ switch__btn_active: isPlay }"
        >
          <img src="../assets/play-solid.svg" alt="" />
        </book-mark-card>
        <book-mark-card
          class="switch__btn"
          @click="$emit('stopPlay')"
          :class="{ switch__btn_active: !isPlay }"
        >
          <img src="../assets/pause-solid.svg" alt="" />
        </book-mark-card>
      </div>
      <div class="select__box">
        <book-mark-card
          class="select__btn"
          @click="lastSpeed"
          :class="{ hiden__select__btn: speedIndex <= 0 }"
        >
          <img src="../assets/backward-solid.svg" alt="" />
        </book-mark-card>

        <div class="select__cards">
          <book-mark-card style="visibility: hidden"></book-mark-card>

          <book-mark-card
            v-for="speed of speeds"
            :key="speed"
            class="select__card"
            :class="{
              chosen__select__card: speed === speeds[speedIndex],
            }"
          >
            <div class="card__content">{{ speed }}</div>
          </book-mark-card>
        </div>

        <book-mark-card
          class="select__btn"
          @click="nextSpeed"
          :class="{ hiden__select__btn: speedIndex >= speeds.length - 1 }"
        >
          <img src="../assets/forward-solid.svg" alt="" />
        </book-mark-card>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapState } from "vuex";
import { TMapState } from "@/types";
import { State } from "@/store";
import BookMarkCard from "@/components/UI/BookMarkCard.vue";

@Options({
  props: {
    isPlay: Boolean,
    speeds: Array,
    speedIndex: Number,
  },
  data() {
    return {
      isFirstLoading: true,
    };
  },
  components: {
    BookMarkCard,
  },
  methods: {
    nextSpeed() {
      if (this.speedIndex < this.speeds.length - 1) {
        const newIndex = this.speedIndex + 1;
        this.$emit("setSpeedIndex", newIndex);
      }
    },
    lastSpeed() {
      if (this.speedIndex > 0) {
        const newIndex = this.speedIndex - 1;
        this.$emit("setSpeedIndex", newIndex);
      }
    },
  },
  computed: {
    ...mapState<any, TMapState<State>>({
      isLoading: (state: State) => state.isLoading,
    }),
  },
  watch: {
    isLoading(newValue) {
      if (!newValue) this.isFirstLoading = false;
    },
  },
})
export default class MapController extends Vue {}
</script>

<style scoped>
.map__controller {
  position: relative;
  top: -30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 0 30px;
  width: 100%;
  height: 5px;
  background-color: red;
}

.switch_btns {
  display: flex;
  flex-direction: row;
  margin-right: 100px;
}

.switch__btn {
  margin: 0 10px;
  transition: transform 0.1s ease-in-out;
}

.switch__btn:hover:not(.switch__btn_active),
.select__btn:hover {
  cursor: pointer;
  transform: translateY(20px);
}

.switch__btn_active {
  background-color: rgb(81, 81, 214);
  transform: translateY(-30px);
}

.select__box {
  display: flex;
  flex-direction: row;
}

.select__btn {
  margin: 0 15px;
  transition: transform 0.1s ease-in-out;
}

.hiden__select__btn,
.hiden__select__btn:hover {
  transform: translateY(-120px);
}

.select__cards {
  position: relative;
}

.select__card {
  position: absolute;
  top: -120px;
  transition: transform 0.3s ease-in-out;
}

.card__content {
  margin: auto;
  font-size: 25px;
  font-weight: bold;
  color: rgb(126, 62, 36);
}

.chosen__select__card {
  transform: translateY(120px);
}

.controller-enter-active,
.controller-leave-active {
  transition: transform 1s ease-in-out;
}

.controller-enter-from,
.controller-leave-to {
  transform: translateY(-120px);
}
</style>
