import AuthForm from "../../components/AuthForm/AuthForm";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./AuthPage.css";
import LoginImg from "../../assets/login.svg"; 

function AuthPage() {
  return (
    <section id="AuthPage">
      <div className="authThemeToggle">
        <ThemeToggle />
      </div>

      <div className="container">
        <div className="auth-illustration">
          <img
            src={LoginImg}
            alt="Illustration"
            loading="lazy"
          />
        </div>
        <div className="auth-form-wrapper">
          <AuthForm />
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
