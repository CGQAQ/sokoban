import React from "react";
import "./cell.css";

function dataToIMG(data) {
    if (data instanceof Array) {
        return data.reduce((f, s) => `url(${f}), url(${s})`);
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
                backgroundImage: dataToIMG(data),
            }}
        />
    );
}
