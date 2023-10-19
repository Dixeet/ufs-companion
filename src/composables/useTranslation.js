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
  nameLabel: {
    en: 'Name',
    fr: 'Nom',
  },
  countLabel: {
    en: 'Count',
    fr: 'Nombre',
  },
  sizeLabel: {
    en: 'Size',
    fr: 'Taille',
  },
  topBaits: {
    en: 'Top Baits',
    fr: 'Top Appâts',
  },
  topLures: {
    en: 'Top Lures',
    fr: 'Top Leurres',
  },
  hookSizeLabel: {
    en: 'Hook Sizes',
    fr: 'Tailles Hameçon',
  },
  lureSizeLabel: {
    en: 'Lure Sizes',
    fr: 'Tailles Leurre',
  },
  flySizeLabel: {
    en: 'Fly Sizes',
    fr: 'Tailles Mouches',
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
