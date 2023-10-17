/* eslint-disable no-console */
import { watchEffect } from 'vue';
export default {
  install: () => {
    if (console) {
      console.vlog = vueLog;
    }
  },
};

function vueLog(exp, trace = false) {
  if (isRef(exp)) {
    let count = 0;
    let initiator = null;
    watchEffect(() => {
      if (trace) {
        try {
          throw new Error();
        } catch (e) {
          for (const line of e.stack.split('\n')) {
            const matches = line.match(/(?<=\s+at setup.*\()(.*)(?=\))/);
            if (matches) {
              initiator = matches[0];
            }
          }
          console.log(initiator);
        }
      }
      console.log(`Ref(${count}):`, toValue(exp));
      count++;
    });
  } else if (isProxy(exp)) {
    let count = 0;
    let initiator = null;
    watchEffect(() => {
      if (trace) {
        try {
          throw new Error();
        } catch (e) {
          for (const line of e.stack.split('\n')) {
            const matches = line.match(/(?<=\s+at setup.*\()(.*)(?=\))/);
            if (matches) {
              initiator = matches[0];
            }
          }
          console.log(initiator);
        }
      }
      console.log(`Proxy(${count}):`, toRaw(exp));
      count++;
    });
  } else {
    console.log(exp);
  }
}
