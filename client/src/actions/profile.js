import axios from 'axios'
import {setAlert} from './alert' 

import{
    GET_PROFILE,
    PROFILE_ERRORS,
    
} from './types';

//Get Current Users Profile

export const getCurrentProfile = () => async dispatch =>{
    try {
        const res = await axios.get('/api/profile/me')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, satus: err.response.satus}
        })
    }
}