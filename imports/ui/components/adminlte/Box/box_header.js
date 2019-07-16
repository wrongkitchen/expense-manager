import React from 'react';

const content = (props) => {
    return (
        <div className="box-header with-border">
            <h3 className="box-title">{props.children}</h3>
            <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="" data-original-title="Collapse">
                    <i className="fa fa-minus"></i>
                </button>
                <button type="button" className="btn btn-box-tool" data-widget="remove" data-toggle="tooltip" title="" data-original-title="Remove">
                    <i className="fa fa-times"></i>
                </button>
          </div>
        </div>
    );
}

export default content;