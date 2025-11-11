import SvgIcon from '@mui/material/SvgIcon';

const EditCircleIcon = (props) => {
    const { stroke = "#6941C6", size = 20, ...rest } = props;

    return (
        <SvgIcon
            {...rest}
            viewBox={`0 0 20 20`}
            fill="none"
            style={{ fontSize: size, color: 'transparent' }}
        >
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 12.5001L16.9875 5.48759C17.671 4.80414 17.671 3.69604 16.9875 3.01259C16.304 2.32914 15.196 2.32914 14.5125 3.01259L7.5 10.0001V12.5001H10Z" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.3334 4.16797L15.8334 6.66797" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.49996 5.89062C4.47665 6.33364 2.30713 9.03402 2.52593 12.0818C2.74472 15.1295 5.27771 17.4923 8.3333 17.499C11.2328 17.4986 13.6921 15.3693 14.1075 12.4998" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </SvgIcon>
    );
};

export default EditCircleIcon;
