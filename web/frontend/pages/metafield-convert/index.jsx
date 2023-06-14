import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { read, utils } from 'xlsx'
import MyDropZoneSingle from '../../components/MyDropZoneSingle'

function IndexPage(props) {
  const [workbook, setWorkbook] = useState(null)
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
        value['c_f["recommended"]["string"]'] = item['c_f["recommended"]["string"]'] || null
        value['c_f["fabric_details"]["string"]'] = item['c_f["fabric_details"]["string"]'] || null
        return value
      })
      setWorkbook(data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleChange = (value) => {
    if (value) getWorkbook(value)
    else setWorkbook(null)
  }

  console.log('workbook:>>', workbook)

  // console.log('keys workbook:>>', Object.keys(workbook[1]))

  return (
    <div>
      <h2>Sartoro Metafield</h2>

      <MyDropZoneSingle onChange={handleChange} />
    </div>
  )
}

IndexPage.propTypes = {}

export default IndexPage
