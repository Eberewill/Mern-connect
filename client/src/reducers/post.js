import {
    GET_POSTS,
    POST_ERROR
} from '../actions/types'
const initialstate ={
    posts:[],
    post: null,
    loading: true,
    error:{}
}
export default function(state = initialstate, action){
    const{type, payload} = action

    switch(type){
        case GET_POSTS:
            return{
              ...state,
              posts: payload,
              loading: false
            }
        case POST_ERROR:
            return{
                ...state,
                error: payload,
                loading:false
            };
        default:
            return state;
            

    }
}
