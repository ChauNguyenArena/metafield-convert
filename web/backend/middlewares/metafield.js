import apiCaller from '../helpers/apiCaller'

const createProductMetafield = async ({ shop, accessToken, data, id }) => {
  return await apiCaller({
    shop,
    accessToken,
    endpoint: `/admin/api/2023-04/products/${id}/metafields.json`,
    method: 'POST',
    data,
  })
}

const Metafield = {
  createProductMetafield,
}

export default Metafield
