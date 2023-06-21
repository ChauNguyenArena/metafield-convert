import apiCaller from '../helpers/apiCaller.js'
import { generateIdFromHandle, generateNameColumn } from '../helpers/generateMetafield.js'
import Product from './product.js'

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

const createProductMetafield = async ({ shop, accessToken, data, id }) => {
  return await apiCaller({
    shop,
    accessToken,
    endpoint: `products/${id}/metafields.json`,
    method: 'POST',
    data,
  })
}

const importMetafieldFromExcel = async ({ shop, accessToken, data }) => {
  let _success = 0,
    _productFail = 0

  for (let item of data) {
    let _product = { product: { title: item.handle } }
    //create Product with handle
    const res = await Product.create({ shop, accessToken, data: _product })

    if (res.product) {
      //create metafield
      await Promise.all(
        requestMetafield.map(async (elm) => {
          if (item[elm.column]) {
            const _data = {
              metafield: {
                namespace: generateNameColumn(elm.column)[0],
                key: generateNameColumn(elm.column)[1],
                type: generateNameColumn(elm.column)[2],
                value: item[elm.column],
              },
            }

            let _res = await createProductMetafield({
              shop,
              accessToken,
              data: _data,
              id: res.product.id,
            })

            console.log('_res:>>', _res)
          }
        })
      )

      _success++
      console.log('_success:>>', _success)
    } else {
      _productFail++
    }
  }

  return { product_success: _success, product_fail: _productFail, total: _success + _productFail }
}

const copyMetafield = async ({ shop, accessToken, data }) => {
  let _success = 0,
    _productFail = 0

  for (let item of data) {
    const res = await Product.find({ shop, accessToken, handle: item.handle })

    if (res.products) {
      let _id = res.products[0].id

      await Promise.all(
        requestMetafield.map(async (elm) => {
          if (item[elm.column]) {
            if (generateNameColumn(elm.metafield)[2] === 'multi_line_text_field') {
              const _data = {
                metafield: {
                  namespace: generateNameColumn(elm.metafield)[0],
                  key: generateNameColumn(elm.metafield)[1],
                  type: generateNameColumn(elm.metafield)[2],
                  value: item[elm.column],
                },
              }

              let _res = await createProductMetafield({
                shop,
                accessToken,
                data: _data,
                id: _id,
              })
              console.log(`${elm.metafield}:>> ${_res}`)
            } else {
              let _value = await Product.find({
                shop,
                accessToken,
                handle: generateIdFromHandle(item[elm.column]),
              })
              _value = _value.products.map((_item) => _item['admin_graphql_api_id'])
              const _data = {
                metafield: {
                  namespace: generateNameColumn(elm.metafield)[0],
                  key: generateNameColumn(elm.metafield)[1],
                  type: elm.metafield.substring(
                    elm.metafield.lastIndexOf('[') + 2,
                    elm.metafield.lastIndexOf(']') - 1
                  ),
                  value: JSON.stringify(_value),
                },
              }

              let _res = await createProductMetafield({
                shop,
                accessToken,
                data: _data,
                id: _id,
              })

              console.log(`${elm.metafield}:>> ${_res}`)
            }
          }
        })
      )

      _success++
    } else {
      _productFail++
    }
  }

  return { product_success: _success, product_fail: _productFail, total: _success + _productFail }
}

const getMetafieldByProduct = async ({ shop, accessToken, idProduct }) => {
  return await apiCaller({
    shop,
    accessToken,
    endpoint: `products/${idProduct}/metafields.json`,
    method: 'GET',
  })
}

const copyMetafields = async ({ shop, accessToken, data }) => {
  let items = []
  let res = null
  let hasNextPage = true
  let nextPageInfo = ''
  let count = 0
  try {
    while (hasNextPage) {
      res = await apiCaller({
        shop,
        accessToken,
        endpoint: `products.json?limit=250&page_info=${nextPageInfo}`,
        pageInfo: true,
      })
      // return{
      if (!res.products) {
        throw res.message
      }
      items = res.products

      for (let item of items) {
        count++
        console.log('count:>>', count)
        const _res = await getMetafieldByProduct({ shop, accessToken, idProduct: item.id })
        if (!_res.metafields) {
          throw _res.message
        }
        if (_res.metafields.length > 0) console.log('_res:>>', _res)
      }

      hasNextPage = res.pageInfo.hasNext
      nextPageInfo = res.pageInfo.nextPageInfo
    }
  } catch (error) {
    console.log('error:>>', error)
    return error
  }

  return
}

const Metafield = {
  createProductMetafield,
  getMetafieldByProduct,
  importMetafieldFromExcel,
  copyMetafield,
  copyMetafields,
}

export default Metafield
