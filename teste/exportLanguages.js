const availableLanguages = [];

export function getLanguages() {
  if (Array.isArray(navigator.languages)) {
    return navigator.languages;
  }
  
  if (navigator.language) {
    return [navigator.language];
  }
  
  if (navigator.userLanguage) {
    return [navigator.userLanguage];
  }
  
  return ['en'];
}