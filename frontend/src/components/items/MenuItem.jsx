import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { AddToCart } from './AddToCart.jsx';
import { Context } from '../../js/store/appContext';

export const MenuItem = ({ item }) => {
	const { actions } = useContext(Context);

	const handleAddToCart = () => {
		actions.addToCart({
			id: item.id,
			name: item.name,
			price: item.price,
			description: item.description,
			path: item.path
		});
		toast.success(`${item.name} añadido al carrito`);
	};

	return (
		<div className="col-sm-6 col-lg-4 all" data-category={item.category}>
			<div className="box">
				<div>
					<div className="img-box">
						<img className='img-fluid w-100' style={{ objectFit: 'cover' }} src={item.path ? `${import.meta.env.VITE_BACKEND_URL}/${item.path}` : 'https://cdn.pixabay.com/photo/2014/12/21/23/36/burgers-575655_1280.png'} alt={item.name} />
					</div>
					<div className="detail-box">
						<h5>{item.name}</h5>
						<p>{item.description}</p>
						<div className="options d-flex justify-content-between align-items-center">
							<h6>${item.price}</h6>
							<AddToCart onClick={handleAddToCart} label={`Agregar ${item.name} al carrito`} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
