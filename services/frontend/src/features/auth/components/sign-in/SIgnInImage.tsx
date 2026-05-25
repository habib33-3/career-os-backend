import Image from "next/image";

import SignInImage from "@/assets/sign-in-image.svg";

const SIgnInImage = () => {
  return (
    <div className="relative w-full max-w-lg rounded-2xl bg-linear-to-br from-primary/10 via-background to-accent/10 p-10">
      <Image
        src={SignInImage}
        alt="Sign in illustration"
        className="h-auto w-full drop-shadow-xl"
        priority
      />
    </div>
  );
};

export default SIgnInImage;
