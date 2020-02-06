import { GET_PROFILE, PROFILE_ERRORS } from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repos:[],
    loading: true,
    errors:{}
}

export default function ( sate = initialState, action){
    const {type, payload} = action;

    switch(type){
        case GET_PROFILE:
        return{
            ...sate,
            profile: payload,
            loading: false
        }
        case PROFILE_ERRORS:
        return{
            ...sate,
            error: payload,
            loading: false
        };
        default:
            return sate;
    }

}