import React from 'react'
import { AddToCart } from './AddToCart.jsx'

export const MenuItem = ({item}) => {
    return (
        <div className="col-sm-6 col-lg-4 all" data-category={item.category}>
            <div className="box">
                <div>
                    <div className="img-box">
                        <img className='img-fluid w-100' style={{objectFit:'cover'}} src={item.path ? `${import.meta.env.VITE_BACKEND_URL}/${item.path}` : 'https://cdn.pixabay.com/photo/2014/12/21/23/36/burgers-575655_1280.png'} alt={item.name} />
                    </div>
                    <div className="detail-box">
                        <h5>{item.name}</h5>
                        <p>{item.description}</p>
                        <div className="options d-flex justify-content-between align-items-center">
                            <h6>${item.price}</h6>
                            <a href="#" aria-label={`Add ${item.name} to cart`}>
                                <AddToCart />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
