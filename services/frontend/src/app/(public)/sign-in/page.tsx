import SIgnInImage from "@/features/auth/components/sign-in/SIgnInImage";
import SignInForm from "@/features/auth/components/sign-in/SignInForm";

const SignInPage = () => {
  return (
    <div className="grid grid-cols-1 bg-background md:grid-cols-2">
      {" "}
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
