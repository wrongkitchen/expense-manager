import React from 'react';

const box_body = (props) => {
    return (
        <div className="box-body">
            {props.children}
        </div>
    );
}

export default box_body;