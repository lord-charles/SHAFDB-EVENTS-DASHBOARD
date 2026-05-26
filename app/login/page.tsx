import { GalleryVerticalEnd } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs relative top-[-30px]">
            <Image
              src="https://res.cloudinary.com/dn3q6mcwp/image/upload/v1751808228/logo_stlg62.png"
              alt="Login background"
              className="h-[200px] w-[250px] object-cover "
              width={250}
              height={200}
            />
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="https://res.cloudinary.com/dn3q6mcwp/image/upload/v1751808106/event_sipzel.jpg"
          alt="Login background"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[1] "
        />
      </div>
    </div>
  );
}
