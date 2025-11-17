"use client";
import React, { useActionState } from "react";
import { signupAction } from "../_actions/signupAction";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [signupActionState, signupFormAction] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const res = await signupAction(formData);
      if (!res.success) {
        alert(res.message);
      }
    },
    null
  );

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded">
      <h2 className="text-2xl font-bold">Signup</h2>

      {/* {error && <p className="text-red-500">{error}</p>} */}

      <form action={signupFormAction} className="flex flex-col gap-4 mt-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
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
      <Link className="btn-primary" href="/login">
        Login
      </Link>
    </div>
  );
}
