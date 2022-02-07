import React, { useState } from 'react';
import {omit} from 'lodash'



const useForm = (callback) => {
     //Form values
     const [values, setValues] = useState({});
     //Errors


     
     const handleSubmit = (event) => {
        if(event) event.preventDefault();
        const msg = validate();
        if(!msg){
            callback();

        }else{
            alert(msg);
        }
    }


    // a method to handle form inputs
     const handleChange = (event) => {
        //To stop default events    
        event.persist();

        let name = event.target.name;
        let val = event.target.value;
        //Let's set these values in state

        setValues({
            ...values,   //spread operator to store old values
            [name]:val,
        })


    }


    const validate = () => {
        //A function to validate each input values
        const {date,time,datacenter} = values
        if (!date){
            return 'Date cannot be empty'
        }
        if (!time){
            return 'Time cannot be empty'
        }
        if(!datacenter){
            return 'Datacenter cannot be empty'
        }
        return null
    }

    return{
        values,
        handleChange,
        handleSubmit
    }
    
    }
    
    export default useForm;