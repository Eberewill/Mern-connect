import axios from 'axios'
import {setAlert} from './alert' 

import{
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERRORS,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_REPOS
    
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
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//get all profile 

export const getProfiles = () => async dispatch =>{
    dispatch({type: CLEAR_PROFILE})
    try {
        const res = await axios.get('/api/profile')

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//get profile By ID 

export const getProfileById = userId => async dispatch =>{
    
    try {
        const res = await axios.get(`/api/profile/${userId}`)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
};

//get Github Repos

export const getGithubRepos = (username) => async dispatch =>{
    dispatch({type: CLEAR_PROFILE})
    try {
        const res = await axios.get(`/api/profile/github/${username}`)

        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, status: err.response.status}
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
            payload: {msg: err.response.statusText, status: err.response.status}
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
            payload: {msg: err.response.statusText, status: err.response.status}
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
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Delete  Experience

export const deleteExperience = id => async dispatch => {
     try {
         const res = await axios.delete(`/api/profile/experience/${id}`)

         dispatch({
             type: UPDATE_PROFILE,
             payload: res.data
         }) 
         dispatch(setAlert( 'Experience removed', 'success'));   
  

     } catch (err) {
        
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Delete an Education

export const deleteEducation = id => async dispatch=>{
    try {
        const res = await axios.delete(`/api/profile/education/${id}`)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        }) 
        dispatch(setAlert('Education Removed', 'success'));  


    } catch (err) {
        dispatch({
            type: PROFILE_ERRORS,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }   
}

//Delete Account

export const deleteAccount = () => async dispatch=>{
    if(window.confirm('Are you sure you want to do this?')){
        try {
             await axios.delete('/api/profile')
    
            dispatch({type: CLEAR_PROFILE,}) 
            dispatch({type:  ACCOUNT_DELETED})

            dispatch(setAlert('Your Account has been succesfully deleted Removed', 'success'));  
    
    
        } catch (err) {
            dispatch({
                type: PROFILE_ERRORS, 
                payload: {msg: err.response.satus,status: err.response.satus}
            })
        }
    }
}
