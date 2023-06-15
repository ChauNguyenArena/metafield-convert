import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { read, utils } from 'xlsx'
import MyDropZoneSingle from '../../components/MyDropZoneSingle'
import { Button, LegacyStack, ProgressBar, Text } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import ConfirmModal from '../../components/ConfirmModal'
import ProductApi from '../../apis/product'
import MetafieldApi from '../../apis/metafield'

let requestMetafield = [
  {
    column: 'c_f["recommended"]["string"]',
    metefield: 'custom["complete_the_look"]["product_reference"]',
  },
  {
    column: 'c_f["fabric_details"]["string"]',
    metefield: 'custom["fabric_care"]["multi_line_text_field"]',
  },
]
function IndexPage(props) {
  const [workbook, setWorkbook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [completedProduct, setCompletedProduct] = useState(0)
  const [percentCompleted, setPercentCompleted] = useState(0)
  // const handleChange = async (e) => {
  //   console.log('file', e.target)
  // }
  const getWorkbook = async (file) => {
    try {
      const f = await file.arrayBuffer()
      const wb = read(f) // parse the array buffer

      const ws = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
      let data = utils.sheet_to_json(ws) // generate objects
      data = data.map((item) => {
        let value = {}
        value['handle'] = item['handle']
        requestMetafield.map((element) => {
          value[element.column] = item[element.column] || null
        })

        return value
      })
      setWorkbook(data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const generateNameColumn = (nameColumn) => {
    return nameColumn.match(/\w+/g)
  }

  const handleConvertMetafield = async (data) => {
    let res = null,
      _data = {}
    for (let item of data) {
      let _product = { product: { title: item.handle.replaceAll('-', ' ') } }
      res = await ProductApi.create(_product)

      if (res.success) {
        for (let elm of requestMetafield) {
          if (item[elm.column] !== null) {
            let _value = generateNameColumn(elm.column)
            _data['namespace'] = _value[0]
            _data['key'] = _value[1]
            _data['type'] = _value[2]
            _data['value'] = item[elm.column]
            console.log('_data', _data)
            let _res = await MetafieldApi.createProductMetafield(
              { metafield: _data },
              res.data.product.id
            )

            console.log(elm.column, ':>>', _res)

            let _val = generateNameColumn(elm.metefield)
            _data['namespace'] = _val[0]
            _data['key'] = _val[1]
            _data['type'] = _val[2]
            _data['value'] =
              _val[2] === 'product_reference'
                ? res.data.product.admin_graphql_api_id
                : item[elm.column]

            let _r = await MetafieldApi.createProductMetafield(
              { metafield: _data },
              res.data.product.id
            )
            // console.log('data', res.data)
            console.log(elm.metefield, ':>>', _r)
          }
        }
        setCompletedProduct(completedProduct + 1)
        let _percent = (completedProduct / data.length) * 100
        setPercentCompleted(_percent)
        // return
      }
    }
  }

  console.log('workbook:>>', workbook)

  // console.log('keys workbook:>>', generateNameColumn('c_f["fabric_details"]["string"]'))

  return (
    <LegacyStack vertical alignment="fill">
      <AppHeader {...props} title="Sartoro Metafield" onBack={() => props.navigate('')} />

      <MyDropZoneSingle onChange={(value) => (value ? getWorkbook(value) : null)} />
      <LegacyStack distribution="trailing">
        <Button
          primary
          onClick={() => {
            setLoading(true)
            handleConvertMetafield(workbook)
          }}
          disabled={!workbook}
        >
          Convert
        </Button>
      </LegacyStack>
      {loading && (
        <ConfirmModal
          title="Metafield Convert"
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <ProgressBar progress={percentCompleted} size="small" color="success" />
              <Text variant="bodyLg" as="p" alignment="center">
                Created {completedProduct} products out of {workbook.length}
              </Text>
            </div>
          }
          onClose={() => setLoading(!loading)}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => setLoading(false),
              destructive: true,
            },
          ]}
        />
      )}
    </LegacyStack>
  )
}

IndexPage.propTypes = {}

export default IndexPage
