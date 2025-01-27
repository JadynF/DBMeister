import RegisterForm from "@/components/(authComponents)/registerForm";

export default function Register() {
    return (
        <div style={containerStyle}>
            <RegisterForm />
        </div> 
    )
}

// Inline styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh', /* Full viewport height */
    width: '100vw', /* Full viewport width */
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    background: '#bfdbfe'
};
