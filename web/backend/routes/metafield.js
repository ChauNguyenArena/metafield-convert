import Controller from './../controllers/metafield.js'

export default function metafieldRoute(app) {
  // app.post('/api/products/metafields', Controller.createProductMetafield)
  app.post('/api/metafields', Controller.importMetafieldFromExcel)
  app.post('/api/metafields/copy', Controller.copyMetafield)
}
