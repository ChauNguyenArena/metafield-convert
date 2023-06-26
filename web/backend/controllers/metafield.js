import getCurrentSession from '../../auth/getCurrentSession.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BullmqJob from '../middlewares/bullmq_job.js'
import Product from '../middlewares/product.js'

export default {
  importMetafieldFromExcel: async (req, res) => {
    try {
      const { shop, accessToken } = getCurrentSession(req, res)
      const products = req.body
      let data = {}

      console.log('_products:>>', products)

      console.log('\n----------------------------------------')
      let group = `bulk_product_group_${Date.now()}`
      data = { jobs: [], group }
      for (
        let page = 1, limit = 100, totalPages = Math.ceil(products.length / limit);
        page <= totalPages;
        page++
      ) {
        let job = await BullmqJob.create(
          'bulk_product_with_metafields',
          { shop, products: products.slice((page - 1) * limit, page * limit) },
          group
        )
        data.jobs.push(job)
      }

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/products/metafields error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },

  copyMetafield: async (req, res) => {
    try {
      const { shop, accessToken } = getCurrentSession(req, res)
      const { count } = req.body
      console.log('count:>>', count)

      const products = await Product.getAll({ shop, accessToken, count })
      let data = {}

      console.log('________ Copy metafields ________')

      console.log('\n----------------------------------------')
      let group = `bulk_product_group_${Date.now()}`
      data = { jobs: [], group }
      for (
        let page = 1, limit = 100, totalPages = Math.ceil(products.length / limit);
        page <= totalPages;
        page++
      ) {
        let job = await BullmqJob.create(
          'bulk_product_update_with_metafield',
          { shop, products: products.slice((page - 1) * limit, page * limit) },
          group
        )
        data.jobs.push(job)
      }

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/products/metafields error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
