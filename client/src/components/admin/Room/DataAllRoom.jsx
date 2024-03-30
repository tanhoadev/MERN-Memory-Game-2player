import React, { useEffect, useState } from 'react'
import { DataTable } from 'simple-datatables';
import DeleteRoom from './DeleteRoom';

function DataAllRoom({ valueTagTh, data, setData, Render }) {
    const [load, setLoad] = useState(true)
    function handleTable() {
        const myTable = document.querySelector("#datatablesSimple");
        const dataTable = new DataTable(myTable, {
            searchable: true,
        });
    }
    useEffect(() => {
        handleTable()
    }, [])
    return (
        <div className="card-body">
            <table id="datatablesSimple">
                <thead>
                    <tr>
                        {valueTagTh.map((item, index) => <th key={index}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, index) =>
                            <tr key={index}>
                                <td>{item._id}</td>
                                <td>{item.iDRoom}</td>
                                <td>
                                    {item.participants.length} / {item.occupancy}
                                </td>
                                <td>
                                    {item.status}
                                </td>
                                <td className='d-flex gap-2'>
                                    <DeleteRoom Render={Render} id={item._id} />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {/* {handleTable()} */}
        </div>
    )
}

export default DataAllRoom