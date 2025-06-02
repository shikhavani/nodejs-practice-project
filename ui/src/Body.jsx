import React, { useEffect } from 'react'
import NavBar from './NavBar';
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer';
import axios from 'axios';
import { BASE_URL, PROFILE_ROUTE } from './utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './utils/userSlice';

const Body = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((store) => store.user);


    const fetchUser = async () => {
        try {
            const res = await axios.get(BASE_URL + PROFILE_ROUTE + "getProfile", {
                withCredentials: true
            });
            if (res.data) {
                dispatch(addUser(res.data));
            }
        } catch (err) {
            if (err.status === 401) {
                return navigate("login")
            }
            console.log(err);
        }
    }

    // after component is rendered, useEffect hook is called
    useEffect(() => {
        if(!userData) {
            fetchUser();
        }
    })

    return (
        <div>
            <NavBar />
            {/** any childrem components will be rendered here */}
            <Outlet />
            <Footer />
        </div>
    )
}

export default Body;