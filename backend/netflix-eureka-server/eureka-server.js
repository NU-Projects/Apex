const express = require('express');

const registry = {};

function setupEurekaRoutes(app) {
    //registration
  app.post('/eureka/apps/:appId', (req, res) => {
    const appId = req.params.appId.toUpperCase();
    const instance = req.body.instance;

    if (!registry[appId]) registry[appId] = [];

    const index = registry[appId].findIndex(i => i.instanceId === instance.instanceId);
    if (index > -1) {
      registry[appId][index] = { ...instance, lastHeartbeat: Date.now() };
    } else {
      registry[appId].push({ ...instance, lastHeartbeat: Date.now() });
    }

    console.log(`Registered: ${appId} -> ${instance.hostName}:${instance.port}`);
    res.status(204).send();
  });


  app.put('/eureka/apps/:appId/:instanceId', (req, res) => {
    const appId = req.params.appId.toUpperCase();
    const instanceId = req.params.instanceId;

    if (registry[appId]) {
      const instance = registry[appId].find(i => i.instanceId === instanceId);
      if (instance) {
        instance.lastHeartbeat = Date.now();
        return res.status(200).send();
      }
    }
    res.status(404).send();
  });

  // Deregister
  app.delete('/eureka/apps/:appId/:instanceId', (req, res) => {
    const appId = req.params.appId.toUpperCase();
    const instanceId = req.params.instanceId;

    if (registry[appId]) {
      registry[appId] = registry[appId].filter(i => i.instanceId !== instanceId);
      console.log(`Deregistered: ${appId} -> ${instanceId}`);
    }
    res.status(200).send();
  });

  //particular app
  app.get('/eureka/apps/:appId', (req, res) => {
    const appId = req.params.appId.toUpperCase();
    const instances = registry[appId] || [];
    res.json({ application: { name: appId, instance: instances } });
  });

//all apps
  app.get('/eureka/apps', (req, res) => {
    const applications = Object.entries(registry).map(([name, instances]) => ({
      name,
      instance: instances
    }));
    res.json({ applications });
  });

  
  app.get('/', (req, res) => {
    res.json({
      message: 'Netflix Eureka Server is running',
      registeredServices: Object.keys(registry).map(name => ({
        name,
        instances: registry[name].length
      }))
    });
  });

  setInterval(() => {
    const now = Date.now();
    for (const appId of Object.keys(registry)) {
      registry[appId] = registry[appId].filter(i => now - i.lastHeartbeat < 90000);
      if (registry[appId].length === 0) delete registry[appId];
    }
  }, 30000);
}

module.exports = { setupEurekaRoutes, registry };
