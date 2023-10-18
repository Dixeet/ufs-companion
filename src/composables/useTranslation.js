const i18n = {
  descriptionLabel: {
    en: 'Description',
    fr: 'Description',
  },
  baitsLabel: {
    en: 'Baits',
    fr: 'Appâts',
  },
  luresLabel: {
    en: 'Lures',
    fr: 'Leurres',
  },
};

const lang = useState('appLanguage');

export function useTranslation(key, overrideLang = null) {
  const result = () => {
    const askedLang = overrideLang ?? lang.value;
    if (typeof key === 'string') {
      return i18n[key] && i18n[key][askedLang];
    }
    if (typeof key === 'object') {
      return key && key[askedLang];
    }
  };

  if (overrideLang) {
    return result();
  } else {
    return computed(result);
  }
}
