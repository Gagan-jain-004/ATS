import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-xl">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
