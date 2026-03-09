import React from 'react';

type SaveButtonProps = {
    onSave: () => void;
};

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
    return (
        <button
            type="button"
            className="rounded bg-green-500 font-bold py-2 w-full cursor-pointer text-gray-800"
            onClick={onSave}
        >
            Guardar Cambios
        </button>
    );
};

export default SaveButton;