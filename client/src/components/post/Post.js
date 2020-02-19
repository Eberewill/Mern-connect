 import React, { useEffect } from 'react';
 import PropTypes from 'prop-types';
 import {connect} from 'react-redux'
 import Spinner from '../layout/Spinner'
 import {getPost} from '../../actions/post'
 
 const Post = ({getPost, post: { post, loading}, match}) => {

    useEffect(()=>{
        getPost(match.params.id)
    }, [getPost])
    
         return <div>
              post   
             </div>
             
        
     
 }
 
 Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
 };
 const mapStateToProps = state => ({
     post: state.Post
 })

 export default connect(mapStateToProps, {getPost})(Post);