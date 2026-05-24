import Image from "next/image";

import SignUpImage from "@/assets/sign-up-image.svg";

const SignUpImages = () => {
  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-accent/10 p-10">
      {/* subtle glow layer */}
      <div className="absolute inset-0 bg-primary/5 opacity-40 blur-3xl" />

      <Image
        src={SignUpImage}
        alt="Sign up illustration"
        className="relative h-auto w-full drop-shadow-xl"
        priority
      />
    </div>
  );
};

export default SignUpImages;
