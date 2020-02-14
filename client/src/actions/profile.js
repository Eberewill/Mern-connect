import axios from 'axios'
import {setAlert} from './alert' 

import{
    GET_PROFILE,
    PROFILE_ERRORS,
    UPDATE_PROFILE
    
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
};

//Create or update Profile

export const createProfile = (FormData,
     history,
      edit = false
      ) => async dispatch =>{
    try {
        const config = {
            headers: {
                'Content-Types': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', FormData, config)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit? 'Profile Updated': 'Profile Created', 'success'));

        if(!edit) {
            history.push('/dashboard');
        }

    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, satus: err.response.satus}
        })
    }
}
//add Experence
export const addExperience = (FormData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Types': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', FormData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert( 'Experience Added', 'success'));        
            history.push('/dashboard');
        

    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, satus: err.response.satus}
        })
    }
}

//add Education
export const addEducation = (FormData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Types': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', FormData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Added', 'success'));        
            history.push('/dashboard');
        

    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, satus: err.response.satus}
        })
    }
}
