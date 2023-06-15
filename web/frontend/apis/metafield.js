import apiCaller from '../helpers/apiCaller'

const MetafieldApi = {
  createProductMetafield: async (data, id) =>
    await apiCaller(`/api/products/${id}/metafields`, 'POST', data),
}

export default MetafieldApi
