// src/contexts/NotyfContext.jsx
import React from "react";
import { Notyf } from "notyf";

const notyfInstance = new Notyf({
    duration: 5000,
    position: {
        x: "right",
        y: "top",
    },
    types: [
        {
            type: "default",
            backgroundColor: "#3B7DDD",
            icon: {
                className: "notyf__icon--success",
                tagName: "i",
            },
        },
        {
            type: "success",
            backgroundColor: "#28a745",
            icon: {
                className: "notyf__icon--success",
                tagName: "i",
            },
        },
        {
            type: "warning",
            backgroundColor: "#ffc107",
            icon: {
                className: "notyf__icon--error",
                tagName: "i",
            },
        },
        {
            type: "danger",
            backgroundColor: "#dc3545",
            icon: {
                className: "notyf__icon--error",
                tagName: "i",
            },
        },
    ],
});

const NotyfContext = React.createContext(notyfInstance);

export const NotyfProvider = ({ children }) => (
    <NotyfContext.Provider value={notyfInstance}>
        {children}
    </NotyfContext.Provider>
);

export default NotyfContext;
