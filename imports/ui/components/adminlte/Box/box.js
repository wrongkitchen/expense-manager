import React from 'react';

const content = (props) => {
    return (
        <div className="box">
            {props.children}
        </div>
    );
}

export default content;