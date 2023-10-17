const state = {
  appLanguage: useStorage('appLanguage', 'en'),
  appFishery: useStorage(
    'appFishery',
    {
      name: {
        en: 'Choose a fishery',
        fr: 'Choisir une pêcherie',
      },
    },
    undefined,
    { shallow: true },
  ),
};

export function useState(key, defaultValue, options) {
  options = {
    shallow: true,
    ...options,
  };
  if (state[key]) {
    return state[key];
  } else {
    if (isRef(defaultValue) || !options.shallow) {
      state[key] = toRef(defaultValue);
    } else {
      state[key] = shallowRef(
        typeof defaultValue === 'function' ? defaultValue() : defaultValue,
      );
    }
    return state[key];
  }
}
