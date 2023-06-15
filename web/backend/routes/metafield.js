import Controller from './../controllers/metafield.js'

export default function metafieldRoute(app) {
  app.post('/api/products/:id/metafields', Controller.createProductMetafield)
}
