import getCurrentSession from '../../auth/getCurrentSession.js'
import ResponseHandler from '../helpers/responseHandler.js'

export default {
  submit: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/api/submition')
    try {
      const { shop, accessToken } = getCurrentSession(req, res)

      let data = {}

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
