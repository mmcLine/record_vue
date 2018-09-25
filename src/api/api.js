import axios from 'axios'
//登录
export const getLogin=()=> {
    return axios.get('/login');
};

export const getMonthData=()=> {
    return axios.get('/record/order/monthchart');
};



