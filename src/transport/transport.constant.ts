export const Services = {
  // users: 'http://users-service:3000',
  users: 'http://localhost:3002/v1',
};

export const ServicePaths = Object.keys(Services).map(
  (service) => service + '/*',
);
