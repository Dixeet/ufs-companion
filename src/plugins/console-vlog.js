/* eslint-disable no-console */
import { watchEffect } from 'vue';
export default {
  install: () => {
    if (console) {
      console.vlog = vueLog;
    }
  },
};

function vueLog(exp, ...args) {
  let count = 0;
  let initiator = null;
  try {
    throw new Error();
  } catch (e) {
    for (const line of e.stack.split('\n')) {
      const matches = line.match(/(?<=\s+at setup \()(.*)(?=\))/);
      if (matches) {
        initiator = matches[0];
      }
    }
    if (isRef(exp)) {
      watchEffect(() => {
        console.log(`Ref(${count}):`, `${initiator}\n  `, toValue(exp));
        count++;
      });
    } else if (isProxy(exp)) {
      watchEffect(() => {
        console.log(`Proxy(${count}):`, `${initiator}\n  `, toRaw(exp));
        count++;
      });
    } else {
      console.log(`${typeof exp}:`, `${initiator}\n  `, exp);
    }
  }
  if (args?.length) {
    console.vlog(...args);
  }
}
