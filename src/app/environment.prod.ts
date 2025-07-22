export const environment = {
  production: true,
  apiUrl: (window as any).apiUrl || 'http://localhost:8088/nour' // fallback local si config.json pas chargé
};