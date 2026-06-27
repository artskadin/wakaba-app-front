export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');

  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    console.error(e);
  }
}
