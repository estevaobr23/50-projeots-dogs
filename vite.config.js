// Página single-file, sem dependência de runtime. `assetsInlineLimit: 0`
// mantém todo asset como arquivo (nada de data-URI inflando o HTML).
export default {
  base: './',
  build: {
    assetsInlineLimit: 0,
  },
};
