import { ChangeEvent } from 'react';

type ImageType = 'primary' | 'secondary' | 'gallery';

interface ImageTypeSelectProps {
    value: ImageType;
    onChange: (newValue: ImageType) => void;
    blockPrimary?: boolean;
    blockSecondary?: boolean;
}

const ImageTypeSelect = ({
    value,
    onChange,
    blockPrimary = false,
    blockSecondary = false,
}: ImageTypeSelectProps) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value as ImageType);
    };

    return (
        <select
            value={value}
            onChange={handleChange}
            className="absolute bottom-2 left-2 bg-white text-sm p-1 rounded shadow"
            disabled={blockPrimary || blockSecondary} // Deshabilitamos las opciones si ya hay una imagen primary/secondary
        >
            <option value="primary" disabled={blockPrimary}>
                Principal {blockPrimary ? '(ya existe)' : ''}
            </option>

            <option value="secondary" disabled={blockSecondary}>
                Secundaria {blockSecondary ? '(ya existe)' : ''}
            </option>

            <option value="gallery">
                Galería
            </option>
        </select>
    );
};

export default ImageTypeSelect;