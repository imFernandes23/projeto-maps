import React from "react";
import api from "../../services/api";
import { MarkerF } from "@react-google-maps/api";
import { useState, useEffect} from  'react'

function ThemesDrawer(props){
    const [fullData, setFullData ] = useState([])

    useEffect(() => {
        getFullData(props.regionId, props.subClassesArray)
    },[props.subClassesArray])

    useEffect(() => {
        console.log(fullData)
    }, [fullData])

    async function getFullData(regionId, subClassesArray){
        let currentPage = 1
        let maxNumPage = 1

        if(subClassesArray.length > 0){
            props.setInLoadScreen(true)
            let RegionActivities = `regions/${regionId}/activities`
            let RegionsSubclasses = ''
            subClassesArray.forEach((element) => {
                RegionsSubclasses = RegionsSubclasses + `&subclasses[]=${element}` 
            })

            let currentData = []

            for ( currentPage; currentPage <= maxNumPage ; currentPage++){
                let newData = []
                let page = `?page=${currentPage}`
                await api.get(RegionActivities + page + RegionsSubclasses).then((res) => {
                    maxNumPage = res.data.last_page;
                    res.data.data.forEach((element) => {
                        let coords = JSON.parse(element.geometry)
                        newData.push({
                            id: element.id, 
                            coord: {lat: coords.coordinates[1], lng: coords.coordinates[0]}, 
                            name: element.name,
                            subName: element.subclass.name,
                            color: element.subclass.class.related_color,
                            icon: element.subclass.related_icon.path})
                    })
                currentData = [...currentData, ...newData]
                })
            }
            
            setFullData(currentData)
        props.setInLoadScreen(false)
        } 
        }
    
    



    
}

export default ThemesDrawer