module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Clash Nodes'
  },
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32']
    }
  ]
};
