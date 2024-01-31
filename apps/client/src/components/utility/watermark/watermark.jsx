const Watermark = ({ children }) => {
    const watermarkStyles = {
        position: 'relative',
        display: 'inline-block',
        textAlign: 'center',
    };

    const textStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: '100%',
        width: '100%',
        transform: 'translate(-50%, -50%) rotate(-25deg)',
        transformOrigin: 'center center',
        background: 'rgba(0, 0, 0, 0.25)',
        color: '#fff',
        fontSize: '12px',
        padding: '5px',
        whiteSpace: 'nowrap',
        lineHeight: '1.2',
    };

    return (
        <div style={watermarkStyles}>
            {children}
            <div style={textStyles}>
                <span>Copyright Reserved Copyright Reserved Copyright Reserved</span>
                <br />
                <span>Copyright Reserved Copyright Reserved Copyright Reserved</span>
                <br />
                <span>Copyright Reserved Copyright Reserved Copyright Reserved</span>
                {/* Add more lines if needed */}
            </div>
        </div>
    );
};

export default Watermark;
