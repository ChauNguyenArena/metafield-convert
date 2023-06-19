import getCurrentSession from '../../auth/getCurrentSession.js'
import ResponseHandler from '../helpers/responseHandler.js'
import Metafield from '../middlewares/metafield.js'

export default {
  createProductMetafield: async (req, res) => {
    try {
      const { shop, accessToken } = getCurrentSession(req, res)

      const { id } = req.params

      const data = await Metafield.createProductMetafield({ shop, accessToken, data: req.body, id })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  importMetafieldFromExcel: async (req, res) => {
    try {
      const { shop, accessToken } = getCurrentSession(req, res)

      const data = await Metafield.importMetafieldFromExcel({ shop, accessToken, data: req.body })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  copyMetafield: async (req, res) => {
    try {
      const { shop, accessToken } = getCurrentSession(req, res)

      const data = await Metafield.copyMetafield({ shop, accessToken, data: req.body })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
