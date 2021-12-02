import React, { useState, useEffect, useRef } from 'react'; 
import{ AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Addcar from './Addcar';
import Editcar from './Editcar';


export default function Carlist() {

    const [cars, setCars]=useState([]); 

    const gridRef= useRef();

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => {
            setCars(data._embedded.cars)}); 
        console.log(cars); 
    }

    useEffect(() => fetchData(), []);

    const deleteCar = (link) => {
        if(window.confirm('Are you sure you wnant to delete car?')){ 
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.error(err))
        }    
    }

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const editCar = (car, link) => {
        console.log(car); 
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        } )
        .then(res => fetchData())
        .catch(err => console.error(err))
    }


    const columns = [
        { headerName: 'Brand', field: 'brand', filter: true, sortable: true },
        { headerName: 'Model', field: 'model', filter: true, sortable: true },
        { headerName: 'Color', field: 'color', filter: true, sortable: true },
        { headerName: 'Fuel', field: 'fuel', filter: true, sortable: true },
        { headerName: 'Year', field: 'year', filter: true, sortable: true },
        { headerName: 'Price', field: 'price', filter: true, sortable: true }, 
        { headerName: '', cellRendererFramework: (params) => <Editcar editCar={editCar} car={gridRef.current.getSelectedNodes()[0].data} /> },
        { headerName: '', field: '_links.self.href', 
        cellRendererFramework: (params) =><div><Button color="error" size="small" onClick={()=>deleteCar(params.value)}>Delete</Button></div> }
    ]

    return (
        <div className="ag-theme-material"style={{height:'700px',width:'70%',margin:'auto'}}>
            <Addcar saveCar={saveCar} />
            <AgGridReact
                ref= {gridRef}
                onGridReady={ params=> gridRef.current= params.api }
                rowSelection="single"
                columnDefs={columns}
                rowData={cars}
                >
            </AgGridReact>
        </div>
    )
}