import React from 'react';

const content = (props) => {
    return (
        <section className="content">
            {props.children}
        </section>
    );
}

export default content;