var dataCacheName = 'HexGL-v1';
var cacheName = 'HexGL-Cache-v1';
var filesToCache = [
'index.html',
'css/BebasNeue-webfont.eot',
'css/BebasNeue-webfont.ttf',
'css/fonts.css',
'css/mobile-controls-2.jpg',
'css/mobile-over.jpg',
'css/BebasNeue-webfont.svg',
'css/BebasNeue-webfont.woff',
'css/mobile-controls-1.jpg',
'css/mobile.jpg',
'css/touchcontroller.css',
'libs/Three.dev.js',
'libs/ShaderExtras.js',
'libs/postprocessing/EffectComposer.js',
'libs/postprocessing/RenderPass.js',
'libs/postprocessing/BloomPass.js',
'libs/postprocessing/ShaderPass.js',
'libs/postprocessing/MaskPass.js',
'libs/Detector.js',
'libs/Stats.js',
'libs/DAT.GUI.min.js',
'bkcore.coffee/controllers/TouchController.js',
'bkcore.coffee/controllers/OrientationController.js',
'bkcore/Timer.js',
'bkcore/ImageData.js',
'bkcore/Utils.js',
'bkcore/threejs/RenderManager.js',
'bkcore/threejs/Shaders.js',
'bkcore/threejs/Particles.js',
'bkcore/threejs/Loader.js',
'bkcore/hexgl/HUD.js',
'bkcore/hexgl/RaceData.js',
'bkcore/hexgl/ShipControls.js',
'bkcore/hexgl/ShipEffects.js',
'bkcore/hexgl/CameraChase.js',
'bkcore/hexgl/Gameplay.js',
'bkcore/hexgl/tracks/Cityscape.js',
'bkcore/hexgl/HexGL.js',
'geometries/bonus/base/base.js',
'geometries/booster/booster.js',
'geometries/ships/feisar/feisar.js',
'geometries/tracks/cityscape/scrapers1.js  ',
'geometries/tracks/cityscape/scrapers2.js  ',
'geometries/tracks/cityscape/startbanner.js  ',
'geometries/tracks/cityscape/start.js  ',
'geometries/tracks/cityscape/track.js',
'geometries/tracks/cityscape/bonus/speed.js',
'textures/tracks/cityscape/collision.png',
'textures/tracks/cityscape/diffuse.jpg',
'textures/tracks/cityscape/height.png',
'textures/tracks/cityscape/start/diffuse.jpg',
'textures/tracks/cityscape/start/start.jpg',
'textures/tracks/cityscape/scrapers2/diffuse.jpg',
'textures/tracks/cityscape/scrapers1/diffuse.jpg',
'textures/skybox/dawnclouds/nx.jpg',
'textures/skybox/dawnclouds/ny.jpg',
'textures/skybox/dawnclouds/nz.jpg',
'textures/skybox/dawnclouds/px.jpg',
'textures/skybox/dawnclouds/pz.jpg',
'textures/skybox/dawnclouds/py.jpg',
'textures/ships/feisar/diffuse.jpg',
'textures/ships/feisar/booster/booster.png',
'textures/ships/feisar/booster/boostersprite.jpg',
'textures/bonus/base/diffuse.jpg',
'textures/particles/cloud.png',
'textures/particles/damage.png',
'textures/particles/spark.png',
'textures/hud/hud-bg.png',
'textures/hud/hex.jpg',
'textures/hud/hud-fg-speed.png',
'textures/hud/hud-fg-shield.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = 'http://xzhan96.github.io/';
  if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        console.log('[ServiceWorker] caches.match');
        return response || fetch(e.request);
      })
    );
  }
});