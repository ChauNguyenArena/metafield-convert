import apiCaller from '../helpers/apiCaller'

const MetafieldApi = {
  createProductMetafield: async (data, id) =>
    await apiCaller(`/api/products/${id}/metafields`, 'POST', data),
  importMetafields: async (data) => await apiCaller(`/api/metafields`, 'POST', data),
  copyMetafields: async (data) => await apiCaller(`/api/metafields/copy`, 'POST', data),
}

export default MetafieldApi
