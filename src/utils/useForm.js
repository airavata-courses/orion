import React, { useState } from 'react';
import {omit} from 'lodash'



const useForm = (callback) => {
     //Form values
     const [values, setValues] = useState({});
     //Errors
     const [errors, setErrors] = useState({});


     
     const handleSubmit = (event) => {
        if(event) event.preventDefault();

        if(Object.keys(errors).length === 0 && Object.keys(values).length !==0 ){
            callback();

        }else{
            alert("There is an Error!");
        }
    }


    // a method to handle form inputs
     const handleChange = (event) => {
        //To stop default events    
        event.persist();

        let name = event.target.name;
        let val = event.target.value;

        validate(event,name,val);
        //Let's set these values in state

        setValues({
            ...values,   //spread operator to store old values
            [name]:val,
        })


    }


    const validate = (event, name, value) => {
        //A function to validate each input values
    
        switch (name) {
            case 'date':
                if (value=='') {
                    // we will set the error state
    
                    setErrors({
                        ...errors,
                        date: 'Date cannot be empty'
                    })
                } else {
    // set the error state empty or remove the error for username input
    
    //omit function removes/omits the value from given object and returns a new object
                    let newObj = omit(errors, "date");
                    setErrors(newObj);
    
                }
                break;
                case 'time':
                if (value=='') {
                    // we will set the error state
    
                    setErrors({
                        ...errors,
                        date: 'Time cannot be empty'
                    })
                } else {
    // set the error state empty or remove the error for username input
    
    //omit function removes/omits the value from given object and returns a new object
                    let newObj = omit(errors, "time");
                    setErrors(newObj);
    
                }
                break;
                case 'datacenter':

                if (value=='') {
                    // we will set the error state
    
                    setErrors({
                        ...errors,
                        datacenter: 'datacenter cannot be empty'
                    })
                } else {
    // set the error state empty or remove the error for username input
    
    //omit function removes/omits the value from given object and returns a new object
                    let newObj = omit(errors, "datacenter");
                    setErrors(newObj);
    
                }
                break;
    
            default:
                break;
        }
    }

    return{
        values,
        errors,
        handleChange,
        handleSubmit
    }
    
    }
    
    export default useForm;