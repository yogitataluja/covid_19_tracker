import React from 'react'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"

const Table = ({countries}) => {
    return (
        <div className="table  ">
        {countries.map(({country,cases})=>( //by destructuing so no need to put value and use valu.country to get value of country
            <tr>
                <td>{country}</td>
                <td><strong>{cases}</strong></td>
            </tr>
            ))}
            
        </div>
    )
}

export default Table
