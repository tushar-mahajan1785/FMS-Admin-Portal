import SvgIcon from '@mui/material/SvgIcon';

const StopwatchIcon = (props) => {
    const { stroke = "#D32F2F", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox="0 0 24 24"
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
           <path d="M9.60005 9.68699L12.1827 13.3044H16.2M9.40005 1.28699H14.687M19.6957 3.51307L22.2 6.01742M1.80005 6.19128L4.3044 3.68694M21.3653 13.5305C21.3653 18.6019 17.2541 22.7131 12.1827 22.7131C7.11124 22.7131 3.00005 18.6019 3.00005 13.5305C3.00005 8.45905 7.11124 4.34786 12.1827 4.34786C17.2541 4.34786 21.3653 8.45905 21.3653 13.5305Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </SvgIcon>
    );
};

export default StopwatchIcon;
