"use client";
import React, { useActionState } from "react";
import { loginAction } from "../_actions/loginAction";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Loginpage() {
  const router = useRouter();
  const [loginState, loginFormAction] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const res = await loginAction(formData);
      if (!res.success) {
        alert(res.message);
      }
      router.push("/dashboard");
    },
    null
  );
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {/* {error && <p className="text-red-500">{error}</p>} */}

      <form action={loginFormAction} className="flex flex-col gap-4 mt-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white p-2 rounded">Signup</button>
      </form>
      <Link className="btn-primary" href="/signup">
        Signup
      </Link>
    </div>
  );
}
