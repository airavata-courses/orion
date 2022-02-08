const { post } = require('request');
var request = require('request');
var axios = require('axios');

module.exports = {


    postIngestor: async function(reqBody) {
        await axios
          .post('http://localhost:3003/api/uri/images/',reqBody)
          .then(ingestorResponse => {
            console.log('Response from l Ingestor:', ingestorResponse.data);
            // if(ingestorResponse.status == 200) {


            //     socket.emit("gateway","hello");
            //     // socket.emit("gateway", {status:{dataingestor:false, plot:false}});
            //     console.log("Sending l status");
            //     // axios.put('http://localhost:3001/status', "Hello");//{status:{dataingestor:false, plot:false}});
            //   } else {
            //     console.log("Not sending l status");
            
            //     socket.emit("gateway", {status:{dataingestor:false, plot:false}});
            //     // axios.put('http://localhost:3001/status').status(400);
            //   }
            return ingestorResponse;
        })
    },
    postPlotter: async function(reqBody ) {
        await axios
          .post('http://localhost:8000/plotWeather/plotgraph',reqBody)
          .then(responseFromPlotter => {
            console.log('Response from Plotter:', responseFromPlotter.data);
            return responseFromPlotter;
        })
    },

    
    /*
    ** This method returns a promise
    ** which gets resolved or rejected based
    ** on the result from the API
    */
    registry_status_get : function(url){
        console.log('registry get reached gateway');
        // return axios.get(url)
        // .then(function(response){
        //     console.log(response.data); // ex.: { holidays: ''}
        //     console.log(response.status); // ex.: 200
        //   });  

        return axios.get(url)
            .then(
                (response) => {
                    var result = response.data;
                    console.log(result);
                },
                (error) => {
                    console.log(error);
                }
            );

        // return
        // new Promise((resolve, reject) => {
        //     request(url, { json: true }, (err, res, body) => {
        //       if (err) reject(err)
        //       resolve(body)
        //     });
        // })
    },
    registry_status_post : function(url,json){
        console.log(json);
        axios
                .post(url, json)
                .then( res => {
                    console.log('Got back res');
                    // return res.config.data;
                    res
                    // res.config.data
                })
                .catch(err => console.log(err))
        // axios
        //     .post(url, json)
        //     .then(
        //         (response) => {
        //             var result = response.data;
        //             console.log(result);
        //         },
        //         (error) => {
        //             console.log(error);
        //         }
        //     );
            // .then(function(response){
            //     console.log('saved successfully')
            //   });  
            // request(url, { json: true }, (err, res, body) => {
            //           if (err) reject(err)
            //           resolve(body)
            //         });    
    }
}
