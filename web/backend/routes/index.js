import productRoute from './product.js'
import storeSettingRoute from './store_setting.js'
import submitionRoute from './submition.js'
import metafieldRoute from './metafield.js'

export default function adminRoute(app) {
  storeSettingRoute(app)
  productRoute(app)
  metafieldRoute(app)
  submitionRoute(app)
}
