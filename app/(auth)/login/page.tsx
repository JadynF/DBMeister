import LoginCanvas from "@/components/loginCanvas";
import LoginForm from "@/components/loginForm";

export default function Login() {
    
    return (
        <div style={containerStyle}>
            <div style={leftHalfStyle}>
                <LoginCanvas />
            </div>
            <div style={rightHalfStyle}>
                <LoginForm />
            </div>
        </div> 
    )
}

// Inline styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh', /* Full viewport height */
    width: '100vw' /* Full viewport width */
  };

const leftHalfStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    height: "100vh",
    width: "100%",
    overflow: "hidden"
  };
  
  const rightHalfStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#bfdbfe'
  };