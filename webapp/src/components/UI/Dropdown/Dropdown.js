import React, {useState} from 'react';
import styles from './Dropdown.module.css'

const Dropdown = ({children, name}) => {
    const [isOpen, setIsOpen] = useState(false);

    // функция-обработчик клика
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.dropdown}>
            <button onClick={handleClick} className={styles.button}>{name}</button>
            {isOpen && <div className={styles.dropdownMenu}>{children}</div>}
        </div>
    );
};

export default Dropdown;