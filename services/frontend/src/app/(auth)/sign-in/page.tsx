import SIgnInImage from "@/features/auth/sign-in/components/SIgnInImage";
import SignInForm from "@/features/auth/sign-in/components/SignInForm";

const SignInPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background md:grid-cols-2">
      {/* LEFT - FORM */}
      <div className="order-1 flex items-center justify-center p-6 md:order-1">
        <SignInForm />
      </div>

      {/* RIGHT - IMAGE */}
      <div className="relative order-2 hidden items-center justify-center overflow-hidden bg-primary/5 p-10 md:flex">
        <SIgnInImage />
      </div>
    </div>
  );
};

export default SignInPage;
