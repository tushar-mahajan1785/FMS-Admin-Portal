import SvgIcon from '@mui/material/SvgIcon';

const SearchIcon = (props) => {
    const { stroke = "#717680", size = 21, height = 21, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 ${size} ${height}`}
            fill="none"
            style={{ fontSize: size, height: height, color: 'transparent' }}
        >
            <path d="M18.0112 17.5459L14.3862 13.9209M16.3445 9.21256C16.3445 12.8945 13.3597 15.8792 9.67784 15.8792C5.99594 15.8792 3.01117 12.8945 3.01117 9.21256C3.01117 5.53067 5.99594 2.5459 9.67784 2.5459C13.3597 2.5459 16.3445 5.53067 16.3445 9.21256Z" stroke={stroke} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default SearchIcon;
