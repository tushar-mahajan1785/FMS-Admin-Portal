

import SvgIcon from '@mui/material/SvgIcon';

const AlertTriangleIcon = (props) => {
    const { stroke = "#6941C6", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M12 8V11.7816" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 15.5391L12 15.5866" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.99995 19.0005H19C19.6625 18.9959 20.2797 18.6634 20.6482 18.1127C21.0166 17.5621 21.0884 16.8647 20.84 16.2505L13.74 4.0005C13.3877 3.36387 12.7175 2.96875 11.99 2.96875C11.2624 2.96875 10.5922 3.36387 10.24 4.0005L3.13995 16.2505C2.89635 16.8502 2.95807 17.5308 3.3056 18.0769C3.65313 18.623 4.24349 18.9672 4.88995 19.0005"
                stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default AlertTriangleIcon;
