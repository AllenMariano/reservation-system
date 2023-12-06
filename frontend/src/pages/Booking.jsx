import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/booking.css"
// import { Link } from 'react-router-dom';
import { Button, Select, Option, Input } from '@material-tailwind/react'; //, Input
import { useUser } from '../context/userContext';
const Booking = () => {
    const { user } = useUser();
    const [service, setService] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const currentDate = new Date();
    const options = { timeZone: 'Asia/Manila' };
    const [selectedDate, setSelectedDate] = useState(currentDate.toLocaleString('en-US', options).split(',')[0]);
    const [selectedTime, setSelectedTime] = useState("")
    const [vehiclePrice, setVehiclePrice] = useState();
    // console.log(vehiclePrice);
    // console.log(service._id);
    console.log(user.data.name)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = (await axios.post(`/api/services/book/:id`)).data;
                setService(data);
                // console.log(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const bookService = async (req, res) => {
        const user_id = user.data._id

        const bookingDetails = {
            service,
            user_id: user_id,
            selectedDate,
            selectedTime,
            vehiclePrice,
        }
        if (bookingDetails.service === "" || bookingDetails.user_id === "" || bookingDetails.selectedDate === "" || bookingDetails.selectedTime === "" || bookingDetails.vehiclePrice === "") {
            setError(true);
            setErrorMessage("Fill all the required field.")
        } else {
            try {
                setLoading(true);
                const result = await axios.post('/api/bookings/book-service', bookingDetails)
                res.send("Service booked successfully")
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
            }
        }
    }
    return (
        <section className='mb-20'>

            <h1 className='text-6xl mt-20 md:text-7xl font-bold mb-20 text-center'>Booking details</h1>
            <div className='booking-card mx-auto w-1/2 border-2 border-orange-500 py-5 px-10 rounded-lg'>
                <h1 className='text-2xl mb-4 font-bold'>{service.title}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>SMALL</th>
                            <th>MEDIUM</th>
                            <th>LARGE</th>
                            <th>X-LARGE</th>
                        </tr>
                    </thead>
                    <tbody className='mt-20'>
                        <tr>
                            <td className="text-gray-700">{service.small}</td>
                            <td className="text-gray-700">{service.medium}</td>
                            <td className="text-gray-700">{service.large}</td>
                            <td className="text-gray-700">{service.x_large}</td>

                        </tr>
                    </tbody>
                </table>
                <div className="w-72 mt-4">
                    {/* last update */}
                    <Select label="Size of vehicle" onChange={(value) => setVehiclePrice(value)}>
                        <Option value={service.small}>SMALL</Option>
                        <Option value={service.medium}>MEDIUM</Option>
                        <Option value={service.large}>LARGE</Option>
                        <Option value={service.x_large}>X-LARGE</Option>
                    </Select>
                    <div className='mt-4'>
                        <Input type='date' label='Pick a date' id='date' onChange={(e) => { setSelectedDate(e.target.value) }} required></Input>
                    </div>
                    <div className="mt-4">
                        <Input type='time' label='Pick a time' id='time' min={"09:00"} max={"18:00"} onChange={(e) => { setSelectedTime(e.target.value) }} required></Input>
                    </div>
                </div>
                <div className="mt-2">
                    <h1><span className='font-bold text-orange-500'>Name : </span>{user.data.name}</h1>
                </div>
                <div className="mt-2">
                    <h1 className='text-md  font-bold'>Reservation Date : {selectedDate} at {selectedTime}</h1>

                </div>
                <div className='mt-6'>
                    <h1 className='text-lg font-bold text-orange-500'>Total : {vehiclePrice ? vehiclePrice : 0}</h1>
                </div>
                <Button className='mt-4' onClick={bookService}>
                    {loading ? "Processing..." : "Pay Now"}
                </Button>
                {error ? <div className='mt-2 text-red-900'>{errorMessage}</div> : <></>}
            </div>
        </section>
    )
}

export default Booking