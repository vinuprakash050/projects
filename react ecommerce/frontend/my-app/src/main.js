import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreencopy from './screens/HomeScreencopy';
import HomeScreenshirt from './screens/HomeScreenshirt';
import HomeScreenpant from './screens/HomeScreenpant';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SignInScreen from './screens/SignInScreen';
import RegisterScreen from './screens/RegisterScreen';
import PaymentScreen from './screens/PaymentScreen';
import SearchScreen from './screens/SearchScreen';
import CartContext from './CartContext';
import MapPopup from './MapPopup';
import { logout } from './actions/productActions';
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Modal from './Modal';

function openMenu() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
        sidebar.classList.add("open");
    } else {
        console.error("Sidebar element not found");
    }
}

function closeMenu() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
        sidebar.classList.remove("open");
    } else {
        console.error("Sidebar element not found");
    }
}

const Header = () => {
    const { totalQuantity, dispatch: cartDispatch } = useContext(CartContext);
    const [weatherInfo, setWeatherInfo] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [position, setPosition] = useState([51.505, -0.09]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (userInfo) {
            const fetchTotalQuantity = async () => {
                try {
                    const response = await fetch(`/api/users/${userInfo.id}/total-quantity`);
                    if (response.ok) {
                        const data = await response.json();
                        cartDispatch({ type: 'UPDATE_TOTAL_QUANTITY', payload: data.totalQuantity });
                    } else {
                        console.error('Failed to fetch total quantity');
                    }
                } catch (error) {
                    console.error('Error fetching total quantity:', error);
                }
            };
            fetchTotalQuantity();
        }
    }, [userInfo, cartDispatch]);
    

    const handleLogout = () => {
        dispatch(logout());
        setDropdownVisible(false);
        cartDispatch({ type: 'CLEAR_CART' });
        cartDispatch({ type: 'UPDATE_TOTAL_QUANTITY', payload: 0 });
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    let DefaultIcon = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIconRetina,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?q=${searchTerm}`);
        console.log('Searching for:', searchTerm);
    };



    L.Marker.prototype.options.icon = DefaultIcon;

    const handleClick1 = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);
                setShowMap(true);
            },
            (error) => console.error("Error getting location:", error)
        );
    };

    const handleCloseMap = () => {
        setShowMap(false);
    };

        useEffect(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Latitude:', latitude, 'Longitude:', longitude); // Log the coordinates
                    const apiKey = 'bfbcf876e6d61d8bffa2e8922b41b9eb'; // Replace with your actual API key
                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
                        .then(response => response.json())
                        .then(data => {
                            console.log('API Response:', data); // Log the API response
                            if (data.weather && data.weather.length > 0 && data.main && data.name && data.sys) {
                                setWeatherInfo(`${data.weather[0].description}, ${data.main.temp}°C`);
                                setUserLocation(`${data.name}, ${data.sys.country}`);
                            } else {
                                setWeatherInfo('Weather not found');
                                setUserLocation('Location not found');
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching weather:', error);
                            setWeatherInfo('Weather not found');
                            setUserLocation('Location not found');
                        });
                }, (error) => {
                    console.error('Geolocation error:', error);
                    setWeatherInfo('Weather not found');
                    setUserLocation('Location not found');
                });
            } else {
                setWeatherInfo('Geolocation not supported');
                setUserLocation('Geolocation not supported');
            }
        }, []);
    return (
        <header className='header'>
            <div className='brand'>
                <button onClick={openMenu}>
                    ☰
                </button>
                <Link to="/"> 
                    <img src="/images/logo.png" alt="Amazona Logo" className="brand-logo" />
                </Link>
                <div className='info'>
                <div className='location'>
                    <button onClick={handleClick1} className="location-button">
                        <i className="fas fa-map-marker-alt"></i> 
                    </button>
                    {userLocation}
                    {showMap && (
                        <div style={{ position: "absolute", top: "50px", left: "50px" }}>
                            <MapPopup position={position} onClose={handleCloseMap} />
                        </div>
                    )}
                </div>

                </div>
            </div>

                <div className='search-bar'>
                    <select className='categorysearch'>
                        <option>clothings</option>
                        <option>electronis</option>
                        <option>accessories</option>
                    </select>
                    <input type="text" value={searchTerm}  onChange={handleSearchChange} placeholder="Search..." />
                    <button onClick={handleSearchSubmit} type="submit"><i className="fas fa-search"></i></button>
                </div>
            <div className='weather' onClick={toggleModal}>
                <i className="fas fa-cloud-sun"></i> {weatherInfo}
            </div>
            <div className='header-links'>
                <Link to="/cart">
                    <i className="fas fa-shopping-cart"></i> {totalQuantity > 0 && (
                        <span className="badge">{totalQuantity}</span>
                    )}
                </Link>
                {userInfo ? (<div className="user-menu">
                        <span className="username" onClick={toggleDropdown}>Hello, {userInfo.name!=null?userInfo.name:"user"}</span>
                        {dropdownVisible && (
                            <div className="dropdown">
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>) : 
                    (<Link to="/signin">Sign in</Link>)}
            </div>
            {modalVisible && (
                <Modal onClose={toggleModal}>
                    <h2 >Weather Details</h2>
                    <p>{weatherInfo}</p>
                    <p>Location: {userLocation}</p>
                    {/* Add more weather details here */}
                </Modal>
            )}

        </header>
    );
}

const Main = () => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector(".sidebar");
            if (sidebar && !sidebar.contains(event.target) && sidebar.classList.contains("open")) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <BrowserRouter>
            <div className='common'>
                <div className='grid-container'>
                    <Header />
                    <aside className="sidebar">
                        <h3>Shopping Categories</h3>
                        <button className="sidebar-close" onClick={closeMenu}>X</button>
                        <ul>
                            <li>
                                <Link to="/shirts" onClick={closeMenu}>Shirts</Link>
                            </li>
                            <li>
                                <Link to="/pants" onClick={closeMenu}>Pants</Link>
                            </li>
                        </ul>
                    </aside>
                    <main className='main'>
                        <div className="content">
                            <Routes>
                                <Route path="/products/:id" element={<ProductScreen />} />
                                <Route path="/cart" element={<CartScreen />} />
                                <Route path="/signin" element={<SignInScreen />} />
                                <Route path="/payment" element={<PaymentScreen />} />
                                <Route path="/" element={<HomeScreencopy />} />
                                <Route path="/shirts" element={<HomeScreenshirt />} />
                                <Route path="/pants" element={<HomeScreenpant />} />
                                <Route path="/search" element={<SearchScreen />} />
                                <Route path='/register' element={<RegisterScreen/>}/>
                            </Routes>
                        </div>
                    </main>
                    <footer className='footer'>
                        all rights reserved.
                    </footer>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default Main;
