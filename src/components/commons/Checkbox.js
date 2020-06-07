import React from 'react';


export const Checkbox = ({id,variant, label, onChange}) => {
    const [isChecked, setChecked] = React.useState(false)
    const handelOnChange = () => {
        const updateChecked = !isChecked 
        setChecked(updateChecked);
        onChange(updateChecked);
    }
    return(
        <React.Fragment>
        
        <div className={`checkbox ${variant && `checkbox-`+variant}`}>
            <input id={id} type="checkbox" checked={isChecked} onChange={() => handelOnChange()}/>
            {label && <label htmlFor={id}>{label}</label>}
        </div>
        </React.Fragment>
    )
}