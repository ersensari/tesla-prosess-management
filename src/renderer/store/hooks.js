import { computed } from "vue";
import { useStore } from "vuex";

export function useState(arr, module) {
  const store = useStore();
  const keypair = arr.map((s) => [s, computed(() => store.state[module][s])]);
  return Object.fromEntries(keypair);
}

export function useGetters(arr, module) {
  const store = useStore();
  const keypair = arr.map((g) => [g, computed(() => store.getters[module][g])]);
  return Object.fromEntries(keypair);
}

export function useMutations(arr, module) {
  const store = useStore();
  const keypair = arr.map((m) => [
    m,
    (input) => store.commit(module + "/" + m, input),
  ]);
  return Object.fromEntries(keypair);
}

export function useActions(arr, module) {
  const store = useStore();
  const keypair = arr.map((a) => [
    a,
    (input) => store.dispatch(module + "/" + a, input),
  ]);
  return Object.fromEntries(keypair);
}
