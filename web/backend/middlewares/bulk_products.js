import { generateNameColumn } from '../helpers/generateMetafield.js'
import BackgroundJob from './background_job.js'
import BullmqActions from './bullmq_actions.js'
import Product from './product.js'
import StoreSetting from './store_setting.js'

let requestMetafield = [
  {
    column: 'c_f["recommended"]["string"]',
    metafield: 'custom["complete_the_look"]["list.product_reference"]',
  },
  {
    column: 'c_f["fabric_details"]["string"]',
    metafield: 'custom["fabric_care"]["multi_line_text_field"]',
  },
]

const create = async (data, backgroundJobId) => {
  try {
    const { shop, products } = data

    let result = []

    // get storeSetting
    let storeSetting = await StoreSetting.findOne({ shop })
    const { accessToken, plusStore } = storeSetting

    // create many products
    await new Promise((resolve, reject) => {
      let count = 0
      let total = products.length
      if (!total) resolve()
      for (let i = 0; i < total; i++) {
        setTimeout(async () => {
          await Product.create({
            shop,
            accessToken,
            data: { product: products[i] },
          })
            .then((res) => {
              console.log(`[${i + 1}/${total}] success`)

              // add to result
              result.push({ id: res.product.id })
            })
            .catch((err) => {
              console.log(`[${i + 1}/${total}] failed:`, err.message)
            })
            .then(() => {
              count++
              if (count == total) resolve()

              // update background job progress
              let progress = Math.ceil((count / total) * 100)
              let status =
                progress == 100 ? BackgroundJob.Status.COMPLETED : BackgroundJob.Status.RUNNING
              BullmqActions.updateJobProgress(backgroundJobId, { progress, status, result })
            })
        }, i * 500)
      }
    })
  } catch (error) {
    console.log('BulkProduct.create error :>> ', error)
    throw error
  }
}

const createWithMetafields = async (data, backgroundJobId) => {
  try {
    const { shop, products } = data

    let _data = products.map((product) => {
      let _product = {}
      _product.title = product.handle

      let _metafields = []
      requestMetafield.map((item) => {
        if (product[item.column] !== null)
          _metafields = [
            ..._metafields,
            {
              namespace: generateNameColumn(item.column)[0],
              key: generateNameColumn(item.column)[1],
              type: generateNameColumn(item.column)[2],
              value: product[item.column],
            },
          ]
      })

      if (_metafields.length > 0) _product.metafields = _metafields

      return _product
    })

    // return

    let result = []

    // get storeSetting
    let storeSetting = await StoreSetting.findOne({ shop })
    const { accessToken, plusStore } = storeSetting

    // create many products
    await new Promise((resolve, reject) => {
      let count = 0
      let total = products.length
      if (!total) resolve()
      for (let i = 0; i < total; i++) {
        setTimeout(async () => {
          await Product.create({
            shop,
            accessToken,
            data: { product: _data[i] },
          })
            .then((res) => {
              console.log(`[${i + 1}/${total}] success`)

              // add to result
              result.push({ id: res.product.id })
            })
            .catch((err) => {
              console.log(`[${i + 1}/${total}] failed:`, err.message)
            })
            .then(() => {
              count++
              if (count == total) resolve()

              // update background job progress
              let progress = Math.ceil((count / total) * 100)
              let status =
                progress == 100 ? BackgroundJob.Status.COMPLETED : BackgroundJob.Status.RUNNING
              BullmqActions.updateJobProgress(backgroundJobId, { progress, status, result })
            })
        }, i * 500)
      }
    })
  } catch (error) {
    console.log('BulkProduct.create error :>> ', error)
    throw error
  }
}

const updateWithMetafields = async (data, backgroundJobId) => {
  try {
    const { shop, products } = data

    console.log('products:>>', products.length)

    return

    let result = []

    // get storeSetting
    let storeSetting = await StoreSetting.findOne({ shop })
    const { accessToken, plusStore } = storeSetting

    // create many products
    await new Promise((resolve, reject) => {
      let count = 0
      let total = products.length
      if (!total) resolve()
      for (let i = 0; i < total; i++) {
        setTimeout(async () => {
          await Product.create({
            shop,
            accessToken,
            data: { product: products[i] },
          })
            .then((res) => {
              console.log(`[${i + 1}/${total}] success`)

              // add to result
              result.push({ id: res.product.id })
            })
            .catch((err) => {
              console.log(`[${i + 1}/${total}] failed:`, err.message)
            })
            .then(() => {
              count++
              if (count == total) resolve()

              // update background job progress
              let progress = Math.ceil((count / total) * 100)
              let status =
                progress == 100 ? BackgroundJob.Status.COMPLETED : BackgroundJob.Status.RUNNING
              BullmqActions.updateJobProgress(backgroundJobId, { progress, status, result })
            })
        }, i * 500)
      }
    })
  } catch (error) {
    console.log('BulkProduct.create error :>> ', error)
    throw error
  }
}

const BulkProduct = { create, createWithMetafields, updateWithMetafields }

export default BulkProduct
