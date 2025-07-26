import React, { useState, useContext } from "react";
import { Context } from '../js/store/appContext';

const ListUsers = () => {
    const { store, actions } = useContext(Context);
    const [users, setUsers] = useState()


    return (
        <div className="table-responsive pt-2">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Última vez</th>
                        <th>Premium</th>
                    </tr>
                </thead>
                <tbody>
                    {store.users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.lastLogin}</td>
                            <td>
                                <span
                                    className={`badge ${user.premium ? "bg-success" : "bg-secondary"
                                        }`}
                                >
                                    {user.premium ? "Sí" : "No"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListUsers;
