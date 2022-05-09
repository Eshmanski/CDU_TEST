import Vuex from "vuex";
import { Coordinate } from "@/types";
import axios from "axios";
import { PointData } from "@/types/Models";
import { chackFakePoint } from "@/utils";

export interface State {
  coordinates: Coordinate[];
  stepCounter: number;
  position: Coordinate;
  isLoading: boolean;
  parceProgress: number;
}

export default new Vuex.Store<State>({
  state: {
    coordinates: [],
    stepCounter: 0,
    position: [0, 0],
    isLoading: false,
    parceProgress: 0,
  },
  getters: {
    maxSteps(state): number {
      return state.coordinates.length;
    },
  },
  mutations: {
    nextStep(state) {
      if (state.stepCounter <= state.coordinates.length) {
        state.position = state.coordinates[state.stepCounter];
        state.stepCounter++;
      }
    },
    setLoading(state, bool) {
      state.isLoading = bool;
    },
    setParseProgress(state, progress) {
      state.parceProgress = progress;
    },
    setCoordinates(state, coordinates) {
      state.coordinates = coordinates;
      state.position = coordinates[0];
    },
  },
  actions: {
    async getCoordinates({ commit }) {
      try {
        commit("setLoading", true);

        const res = await axios.get(
          "https://bibix.gitlab.io/cdu-test/coordinates.ts",
          { headers: { "Content-Type": "text/plain" } }
        );

        const data = [
          ...res.data.matchAll(
            /".{19}",\s*([1-8]?\d(\.\d+)?|90(\.0+)?),\s*(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g
          ),
        ];

        const coordinates = await this.dispatch("parseStrToCordinate", data);
        commit("setCoordinates", coordinates);
        commit("setLoading", false);
      } catch (e) {
        console.error(e);
      }
    },
    parseStrToCordinate({ commit }, data: string[]) {
      const packageSize = 100;
      const coordinates: Coordinate[] = [];

      return new Promise((res) => {
        let parsedCoordinates: Coordinate[] = [];
        let stepOfData = 0;

        const parcePackage = () =>
          setTimeout(() => {
            let stepOfPacage = 0;
            let lastPointData: PointData | null = null;

            while (stepOfPacage < packageSize) {
              if (stepOfData + stepOfPacage >= data.length) break;

              const tmp: string[] =
                data[stepOfData + stepOfPacage][0].split(", ");
              const pointData: PointData = {
                date: new Date(tmp[0].substring(1, 20)),
                lon: Number(tmp[1]),
                lat: Number(tmp[2]),
              };

              if (
                !chackFakePoint(lastPointData, pointData) &&
                lastPointData !== null
              ) {
                parsedCoordinates.push([lastPointData.lon, lastPointData.lat]);
              }

              lastPointData = pointData;
              stepOfPacage++;
            }

            stepOfData += stepOfPacage;

            if (stepOfData < data.length) {
              parsedCoordinates.forEach((coordinate) =>
                coordinates.push(coordinate)
              );

              commit(
                "setParseProgress",
                Math.floor(((stepOfData + 1) / data.length) * 100)
              );

              parsedCoordinates = [];
              parcePackage();
            } else {
              coordinates.push([lastPointData!.lon, lastPointData!.lat]);
              commit("setParseProgress", 100);
              res(coordinates);
            }
          }, 0);

        parcePackage();
      });
    },
  },
  modules: {},
});
