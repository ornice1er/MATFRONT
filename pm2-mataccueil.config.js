module.exports = {
  apps: [
    {
      name: 'mataccueil', // Nom de ton application
      script: './dist/mataccueil/server/server.mjs', // Chemin vers le fichier généré par Angular Universal
      exec_mode: 'cluster', // Mode cluster pour améliorer la performance
      env: {
        NODE_ENV: 'production',
        PORT: 4000, // Port sur lequel l'application sera disponible
      },
    },
  ],
};
