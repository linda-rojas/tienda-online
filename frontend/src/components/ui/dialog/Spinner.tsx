import { GiFlatTire } from 'react-icons/gi';

export default function Spinner() {
    return (
        <div className="spinner-container">
            {/* Texto "AC" */}
            <span className="spinner-text">AC</span>
            {/* Ícono circular representando la O */}
            <div className="spinner-icon bg-gray-300">
                <GiFlatTire className='text-gray-800' />
            </div>
        </div>
    );
}