import React, {useState} from 'react';
import styles from './Measures.module.css'
import Modal from "../../components/UI/Modal/Modal";
import MeasureForm from "./MeasureForm";

const MeasureRow = ({measure, callbacks}) => {
    const [editModalState, setEditModalState] = useState(false)
    const edit = callbacks.editMeasure;
    callbacks.editMeasure = (measure) => {
        edit(measure);
        setEditModalState(false);
    }
    return (
        <tr key={measure.id}>
            <td>{measure.measureName}</td>
            <td>{measure.measureSymbol}</td>
            <td>
                <div className={styles.actions_block} >
                    <button onClick={() => callbacks.deleteMeasure(measure)} className={[styles.button, styles.red].join(' ')}>Удалить</button>
                    <button onClick={() => setEditModalState(true)} className={[styles.button, styles.default].join(' ')}>Изменить</button>
                    <Modal visible={editModalState} setVisible={setEditModalState}>
                        <MeasureForm forUpdateFlag={true} callbackMeasure={callbacks} measure={measure}>

                        </MeasureForm>
                    </Modal>
                </div>
            </td>
        </tr>
    );
};

export default MeasureRow;