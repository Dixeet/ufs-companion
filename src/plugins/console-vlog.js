/* eslint-disable no-console */
export default {
  install: () => {
    if (console) {
      console.vlog = vueLog;
    }
  },
};

function vueLog(exp) {
  if (isRef(exp)) {
    console.log('Ref:', toValue(exp));
  } else if (isProxy(exp)) {
    console.log('Proxy:', toRaw(exp));
  } else {
    console.log(exp);
  }
}
