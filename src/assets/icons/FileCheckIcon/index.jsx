import SvgIcon from '@mui/material/SvgIcon';

const FileCheckIcon = (props) => {
    const { stroke = "white", size = 24, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 24 24`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path d="M15.0001 2H9.00012C8.44784 2 8.00012 2.44772 8.00012 3V5C8.00012 5.55228 8.44784 6 9.00012 6H15.0001C15.5524 6 16.0001 5.55228 16.0001 5V3C16.0001 2.44772 15.5524 2 15.0001 2Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.9999 4H17.9999C18.5303 4 19.039 4.21071 19.4141 4.58579C19.7892 4.96086 19.9999 5.46957 19.9999 6V20C19.9999 20.5304 19.7892 21.0391 19.4141 21.4142C19.039 21.7893 18.5303 22 17.9999 22H5.99988C5.46944 22 4.96074 21.7893 4.58566 21.4142C4.21059 21.0391 3.99988 20.5304 3.99988 20V6C3.99988 5.46957 4.21059 4.96086 4.58566 4.58579C4.96074 4.21071 5.46944 4 5.99988 4H7.99988" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 14L11 16L15 12" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default FileCheckIcon;
