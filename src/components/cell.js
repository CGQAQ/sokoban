import React from 'react';
import './cell.css';

function dataToIMG(data) {
    if (data instanceof Array) {
        if (data.length >= 3) {
            // console.log(data);
        }

        return data.reduce((f, s) => `${f}, url(${s})`, '').substr(2);
    } else {
        return `url(${data})`;
    }
}

export function Cell({ size, data }) {
    return (
        <div
            className="cell"
            style={{
                height: `${size}em`,
                width: `${size}em`,
                backgroundImage: dataToIMG(data)
            }}
        />
    );
}
