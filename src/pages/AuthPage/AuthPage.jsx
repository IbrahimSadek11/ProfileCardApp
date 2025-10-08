import AuthForm from "../../components/AuthForm/AuthForm";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./AuthPage.css";

function AuthPage() {
  return (
    <section id="AuthPage">
      <div className="authThemeToggle">
        <ThemeToggle />
      </div>

      <div className="container">
        <div className="auth-illustration">
          <img
            src="/assets/login.svg"
            alt="Login Illustration"
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
