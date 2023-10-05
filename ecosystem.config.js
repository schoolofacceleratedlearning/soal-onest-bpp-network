module.exports = {
  apps: [
    {
      name: "Protocol-Server-bpp-network",
      script: "./dist/app.js",
      watch: false,
      instances: 3,
    },
  ],
};
