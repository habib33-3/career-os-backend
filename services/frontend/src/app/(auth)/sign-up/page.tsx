import SignUpForm from "@/features/auth/components/sign-up/SignUpForm";
import SignUpImages from "@/features/auth/components/sign-up/SignUpImages";

const SignUpPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background md:grid-cols-2">
      {/* LEFT - IMAGE (reversed) */}
      <div className="relative order-1 hidden items-center justify-center overflow-hidden bg-primary/5 p-10 md:order-1 md:flex">
        <SignUpImages />
      </div>

      {/* RIGHT - FORM */}
      <div className="order-2 flex items-center justify-center p-6 md:order-2">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
