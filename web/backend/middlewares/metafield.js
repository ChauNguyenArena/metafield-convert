import apiCaller from '../helpers/apiCaller.js'

const createProductMetafield = async ({ shop, accessToken, data, id }) => {
  console.log('data in middle:>>', data)
  return await apiCaller({
    shop,
    accessToken,
    endpoint: `products/${id}/metafields.json`,
    method: 'POST',
    data,
  })
}

const Metafield = {
  createProductMetafield,
}

export default Metafield
