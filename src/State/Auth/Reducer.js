import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType"

const initialState={
    isLoading:false,
    error:null,
    jwt:null,
    role:null
}

export const authReducer=(state=initialState,action)=>{
     switch(action.type){
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
            return {...state,isLoading:true,error:null}     
        
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {...state,isLoading:false,error:null,jwt:action.payload.jwt,role:action.payload.role}     
            
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
            return {...state,isLoading:false,error:action.payload}  
        
        case LOGOUT:
            return initialState;
        default:
           return state; 
     }

}