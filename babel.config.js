module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: '@mui/material',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'core',
    ],
    [
      'import',
      {
        libraryName: '@mui/icons-material',
        camel2DashComponentName: false,
      },
      'icons',
    ],
  ],
};
